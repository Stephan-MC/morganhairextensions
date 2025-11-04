import {
	Component,
	DOCUMENT,
	effect,
	Inject,
	inject,
	Renderer2,
	signal,
} from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import {
	ActivatedRoute,
	NavigationCancel,
	NavigationEnd,
	NavigationError,
	NavigationStart,
	ResolveEnd,
	ResolveStart,
	Router,
	RouterLink,
	RouterOutlet,
} from "@angular/router";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { toSignal } from "@angular/core/rxjs-interop";
import { filter, map, of, switchMap, tap, timer } from "rxjs";
import { Meta } from "@angular/platform-browser";
import { environment } from "../environments/environment";

@Component({
	selector: "web-root",
	imports: [RouterOutlet, RouterLink, MatIconModule, MatProgressBarModule],
	templateUrl: "./app.ng.html",
	styleUrl: "./app.scss",
})
export class App {
	private _meta = inject(Meta);
	private _renderer = inject(Renderer2);
	private _document = inject(DOCUMENT);
	private _router = inject(Router);
	private _route = inject(ActivatedRoute);
	protected readonly title = signal("web");

	loading = toSignal(
		this._router.events.pipe(
			filter(
				(event) =>
					event instanceof NavigationStart ||
					event instanceof NavigationEnd ||
					event instanceof NavigationError ||
					event instanceof NavigationCancel ||
					event instanceof ResolveStart ||
					event instanceof ResolveEnd,
			),
			switchMap((event) => {
				if (event instanceof NavigationStart || event instanceof ResolveStart) {
					return of(true);
				}

				return timer(400).pipe(map(() => false));
			}),
		),
		{
			initialValue: false,
		},
	);

	constructor() {
		this._router.events
			.pipe(
				filter((e) => e instanceof NavigationEnd),
				map(() => `${environment.url.base}${this._router.url.split("?")[0]}`),

				// Set canonical
				tap((url) => {
					const element = this._document.querySelector("link[rel='canonical']");

					if (element) {
						this._renderer.removeChild(this._document.head, element);
					}

					const link: HTMLLinkElement = this._renderer.createElement("link");
					this._renderer.setAttribute(link, "rel", "canonical");
					this._renderer.setAttribute(link, "href", url);
					this._renderer.appendChild(this._document.head, link);
				}),

				// Update meta tags
				tap((url) => {
					this._meta.updateTag({
						id: "og:url",
						property: "og:url",
						content: url,
					});
				}),
			)
			.subscribe();
	}
}
