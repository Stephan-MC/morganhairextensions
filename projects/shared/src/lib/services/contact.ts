import { inject, Injectable, signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { toObservable } from "@angular/core/rxjs-interop";
import { debounceTime, switchMap } from "rxjs";
import { ENVIRONMENT } from "../types";

@Injectable({
	providedIn: "root",
})
export class Contact {
	#http = inject(HttpClient);
	#environment = inject(ENVIRONMENT);
	params = signal<{ [k: string]: any }>({});
	params$ = toObservable(this.params);

	contacts$ = this.params$.pipe(
		debounceTime(500),
		switchMap((params) =>
			this.#http.get(`${this.#environment.url.api}/contacts`, {
				params,
			}),
		),
	);

	store(data: Record<"name" | "email" | "subject" | "message", string>) {
		return this.#http.post(`${this.#environment.url.api}/contact`, data);
	}
}
