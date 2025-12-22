import { isPlatformServer } from "@angular/common";
import {
	DOCUMENT,
	inject,
	Injectable,
	makeStateKey,
	PLATFORM_ID,
	signal,
} from "@angular/core";

// State key for transferring cookies from server to client
const COOKIE_STATE_KEY = makeStateKey<string[]>("ssr_cookies");

export interface CookieOptions {
	expires?: Date | string | number;
	path?: string;
	domain?: string;
	secure?: boolean;
	sameSite?: "Lax" | "Strict" | "None";
	"max-age"?: number;
}

export interface BrowserCookie extends CookieOptions {
	value: string;
}

@Injectable({
	providedIn: "root",
})
export class Cookie {
	private _document = inject(DOCUMENT);
	private _platformId = inject(PLATFORM_ID);

	private _cookies = signal(new Map<string, BrowserCookie>());

	protected isServer = isPlatformServer(this._platformId);

	get(name: string) {
		if (!this.isServer) {
			const cookies = this._document.cookie.split(";").map((c) => c.trim());
			const cookie = cookies
				.find((c) => c.toLowerCase().startsWith(name.toLowerCase() + "="))
				?.split("=")[1];

			return decodeURIComponent(cookie ?? "");
		}

		return this._cookies().get(name);
	}

	getAll() {
		return new Map(this._cookies());
	}

	has(name: string) {
		if (!this.isServer) {
			return !!this._document.cookie.match(new RegExp(`${name}=`));
		}

		return this._cookies().has(name);
	}

	set(name: string, value: string, options: CookieOptions = {}) {
		if (!this.isServer) {
			document.cookie = `${name}=${encodeURIComponent(value)}; ${this.buildOptionsString(options)}`;
		}

		this._cookies().set(name, { ...options, value });
	}

	setCookieFromString(cookie: string) {
		/** Skip all http only cookies */
		if (cookie.toLowerCase().match(/httponly;/)) {
			return;
		}

		const [nameValue, ...segments] = cookie
			.split(";")
			.map((part) => part.trim());
		const [name, value] = nameValue
			.split("=")
			.map((p) => decodeURIComponent(p));
		const options: CookieOptions = {};

		segments.forEach((segment) => {
			const [key, value] = segment.split("=") as [
				k: keyof CookieOptions,
				v: string,
			];

			/** @ts-ignore */
			options[key.toLowerCase()] = value;
		});

		this.set(name, value, options);
	}

	delete(name: string, options: Pick<CookieOptions, "path" | "domain"> = {}) {
		if (!this.isServer) {
			this._document.cookie = `${name}=${options.path ? "; path=" + options.path : ""}${options.domain ? "; domain=" + options.domain : ""}; expires=${new Date(0).toUTCString()}`;
		}
		this._cookies().delete(name);
	}

	clear() {
		if (!this.isServer) {
			const cookies = this._document.cookie
				.split(";")
				.map((part) => part.trim());
			const domain = window.location.hostname.split(".").splice(-2).join(".");
			cookies.forEach((cookie) => {
				const [name, value] = cookie.split("=");

				this._document.cookie = `${name}=; domain=${domain}; expires=${new Date(0).toUTCString()}`;
				this._document.cookie = `${name}=; domain=.${domain}; expires=${new Date(0).toUTCString()}`;
			});
		}

		this._cookies().forEach((cookie, name) => {
			this.delete(name, cookie);
		});
	}

	/** Builds the options part of the cookie string. */
	private buildOptionsString(options: CookieOptions): string {
		let optsStr = "";
		if (options.expires) {
			if (options.expires instanceof Date) {
				optsStr += `; expires=${options.expires.toUTCString()}`;
			} else {
				optsStr += `; expires=${options.expires}`;
			}
		}
		if (options["max-age"]) {
			optsStr += `; max-age=${options["max-age"]}`;
		}
		optsStr += `; path=${options.path || "/"}`;
		if (options.domain) {
			optsStr += `; domain=${options.domain}`;
		}
		if (options.secure) {
			optsStr += "; Secure";
		}
		if (options.sameSite) {
			optsStr += `; SameSite=${options.sameSite}`;
		}
		return optsStr;
	}
}
