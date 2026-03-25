import { CurrencyPipe } from "@angular/common";
import { Component, effect, inject, input, linkedSignal } from "@angular/core";
import {
	takeUntilDestroyed,
	toObservable,
	toSignal,
} from "@angular/core/rxjs-interop";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatSelectModule } from "@angular/material/select";
import { MatTabsModule } from "@angular/material/tabs";
import { Meta, Title } from "@angular/platform-browser";
import { Subject, switchMap } from "rxjs";
import type { Model } from "shared";
import { Cart } from "../common/services/cart";

@Component({
	selector: "web-wig",
	imports: [
		MatTabsModule,
		MatFormFieldModule,
		MatSelectModule,
		MatButtonModule,
		CurrencyPipe,
		MatIconModule,
	],
	templateUrl: "./wig.page.ng.html",
	styleUrl: "./wig.page.scss",
})
export class WigPage {
	#meta = inject(Meta);
	#title = inject(Title);
	wig = input.required<Model.Wig>();

	length = linkedSignal(() => this.wig()?.length);
	#cart = inject(Cart);
	#toCart = new Subject<void>();
	inCart = toSignal(
		toObservable(this.length).pipe(
			switchMap((length) => this.#cart.has(length.id)),
		),
		{ initialValue: false },
	);

	constructor() {
		this.#toCart
			.asObservable()
			.pipe(
				takeUntilDestroyed(),
				switchMap(() =>
					this.#cart.add({ ...this.wig(), length: this.length() }),
				),
			)
			.subscribe();

		effect(() => {
			this.#title.setTitle(this.wig()?.name || "Morgan Hair Wig");
		});
	}

	ngOnInit() {
		if (this.wig()) {
			this.#meta.addTags(
				[
					{
						id: "description",
						name: "description",
						content: this.wig()?.description,
					},

					// OpenGrap
					{
						id: "og:description",
						property: "og:description",
						content: this.wig()?.description,
					},
					{
						id: "og:title",
						property: "og:title",
						content: this.wig()?.name,
					},
					{
						id: "og:image",
						property: "og:image",
						content: this.wig()?.length?.thumbnail.url.replace(
							/^http:/,
							"https:",
						),
					},
				],
				false,
			);
		} else {
			console.log("redirecting");
		}
	}

	addToCart() {
		this.#toCart.next();
	}
}
