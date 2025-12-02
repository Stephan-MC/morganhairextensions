import { CurrencyPipe, NgOptimizedImage } from "@angular/common";
import { Component, inject, output } from "@angular/core";
import { takeUntilDestroyed, toSignal } from "@angular/core/rxjs-interop";
import { MatButtonModule } from "@angular/material/button";
import { RouterLink } from "@angular/router";
import { Subject, switchMap } from "rxjs";
import type { Model } from "shared";
import { Cart as CartService } from "../../services/cart";

@Component({
	selector: "web-cart",
	imports: [RouterLink, CurrencyPipe, MatButtonModule, NgOptimizedImage],
	templateUrl: "./cart.ng.html",
	styleUrl: "./cart.scss",
})
export class Cart {
	close = output();
	#cart = inject(CartService);

	items = toSignal(this.#cart.cart$, { requireSync: true });
	subtotal = toSignal(this.#cart.subtotal$, { requireSync: true });

	#remove = new Subject<Model.Wig>();
	#reduce = new Subject<Model.Wig>();
	#add = new Subject<Model.Wig>();

	constructor() {
		this.#remove
			.pipe(
				takeUntilDestroyed(),
				switchMap((item) => this.#cart.remove(item.id)),
			)
			.subscribe();

		this.#add
			.pipe(
				takeUntilDestroyed(),
				switchMap((item) => this.#cart.add(item)),
			)
			.subscribe();

		this.#reduce
			.pipe(
				takeUntilDestroyed(),
				switchMap((item) => this.#cart.reduce(item.length.id)),
			)
			.subscribe();
	}

	removeItem(item: Model.Wig) {
		this.#remove.next(item);
	}

	increment(item: Model.Wig) {
		this.#add.next(item);
	}

	decrement(item: Model.Wig) {
		this.#reduce.next(item);
	}
}
