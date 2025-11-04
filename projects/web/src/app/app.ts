import {
    Component,
    DOCUMENT,
    Inject,
    inject,
    Renderer2,
    signal
} from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { Meta } from "@angular/platform-browser";
import {
    NavigationCancel,
    NavigationEnd,
    NavigationError,
    NavigationStart,
    ResolveEnd,
    ResolveStart,
    Router,
    RouterLink,
    RouterOutlet
} from "@angular/router";
import { filter, map, of, switchMap, tap, timer } from "rxjs";
import { environment } from "../environments/environment";

@Component({
	selector: "web-root",
	imports: [RouterOutlet, RouterLink, MatIconModule, MatProgressBarModule],
	templateUrl: "./app.ng.html",
	styleUrl: "./app.scss",
})
export class App {
	private _router = inject(Router);
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

	constructor(meta: Meta, renderer: Renderer2, @Inject(DOCUMENT) document: Document) {
		this._router.events
			.pipe(
				filter((e) => e instanceof NavigationEnd),
				map(() => `${environment.url.base}${this._router.url.split("?")[0]}`),

				// Set canonical
				tap((url) => {
					const element = document.querySelector("link[rel='canonical']");

					if (element) {
						renderer.removeChild(document.head, element);
					}

					const link: HTMLLinkElement = renderer.createElement("link");
					renderer.setAttribute(link, "rel", "canonical");
					renderer.setAttribute(link, "href", url);
					renderer.appendChild(document.head, link);
				}),

				// Update meta tags
				tap((url) => {
					meta.updateTag({
						id: "og:url",
						property: "og:url",
						content: url,
					});
				}),
			)
			.subscribe();

    meta.addTags([
      {
      id: 'keywords',
      name: 'keywords',
      content: 'morgan hair, hair, wig, wigs, accessories, accessory, shop, shopping, buy, sell, seller, sellers, styling, stylist, stylists, style, styles, accessories, accessory, accessories, accessory, accessories, accessory, accessories, accessory, accessories, accessory, accessories, accessory, accessories, accessory, accessories, accessory, accessories, accessory, accessories, accessory, accessories, accessory, accessories, accessory, accessories, accessory, accessories, accessory, accessories, accessory, accessories, accessory, accessories, accessory, accessories, accessory, accessories, accessory, accessories, accessory, accessories, accessory, accessories, accessory, accessories, accessory, accessories, accessory, accessories, accessory, accessories, accessory, accessories, accessory, accessories, accessory, accessories, accessory, accessories, accessory, accessories, accessory, accessories, accessory, accessories, accessory, accessories, accessory, accessories, accessory, accessories, lace, frontal'
    },
      {
        property: "og:image",
        id: "og:image",
        content: "/assets/images/morgan-hair-circular-flyer.jpeg",
      },
    ]);
	}
}
