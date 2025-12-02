import { Component, inject, signal } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import {
	FormSubmittedEvent,
	NonNullableFormBuilder,
	ReactiveFormsModule,
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { Router, RouterLink } from "@angular/router";
import { filter, switchMap } from "rxjs";

@Component({
	selector: "web-not-found",
	imports: [
		MatButtonModule,
		MatInputModule,
		MatFormFieldModule,
		MatIconModule,
		RouterLink,
		ReactiveFormsModule,
	],
	templateUrl: "./not-found.page.ng.html",
	styleUrl: "./not-found.page.scss",
})
export class NotFoundPage {
	#router = inject(Router);
	#fb = inject(NonNullableFormBuilder);
	form = this.#fb.group({
		q: this.#fb.control(""),
	});

	constructor() {
		this.form.events
			.pipe(
				takeUntilDestroyed(),
				filter((event) => event instanceof FormSubmittedEvent),
				switchMap(() =>
					this.#router.navigate(["/shop"], {
						queryParams: { ...this.form.getRawValue() },
					}),
				),
			)
			.subscribe();
	}
}
