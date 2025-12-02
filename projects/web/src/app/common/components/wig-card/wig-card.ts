import { AsyncPipe, CurrencyPipe } from "@angular/common";
import {
	ChangeDetectionStrategy,
	Component,
	inject,
	input,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { RouterLink } from "@angular/router";
import { Subject, switchMap, tap } from "rxjs";
import type { Model } from "shared";
import { Cart } from "../../services/cart";

@Component({
	selector: "web-wig-card",
	imports: [AsyncPipe, CurrencyPipe, RouterLink],
	templateUrl: "./wig-card.ng.html",
	styleUrl: "./wig-card.scss",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WigCard {
	wig = input.required<Model.Wig>();
	#toCart = new Subject<void>();
	cart = inject(Cart);

	constructor() {
		this.#toCart
			.pipe(
				takeUntilDestroyed(),
				tap(() => console.log("Adding to cart")),
				switchMap(() => this.cart.add(this.wig())),
			)
			.subscribe();
	}

	addToCart() {
		this.#toCart.next();
	}
}
