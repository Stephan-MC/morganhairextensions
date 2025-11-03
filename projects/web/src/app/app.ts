import { Component, inject, signal } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import {
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

@Component({
	selector: "web-root",
	imports: [RouterOutlet, RouterLink, MatIconModule, MatProgressBarModule],
	templateUrl: "./app.html",
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
}
