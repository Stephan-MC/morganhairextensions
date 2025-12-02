import {
	CurrencyPipe,
	NgOptimizedImage,
	NgPlural,
	NgPluralCase,
} from "@angular/common";
import { Component, inject } from "@angular/core";
import { takeUntilDestroyed, toSignal } from "@angular/core/rxjs-interop";
import { MatButtonModule } from "@angular/material/button";
import { MatFormField, MatInputModule } from "@angular/material/input";
import { MatSortModule } from "@angular/material/sort";
import { MatTableModule } from "@angular/material/table";
import { RouterLink } from "@angular/router";
import { map, Subject, switchMap } from "rxjs";
import type { CartItem as CartItemType, Model } from "shared";
import { Cart } from "../common/services/cart";

@Component({
	selector: "web-cart",
	imports: [
		NgPlural,
		NgPluralCase,
		RouterLink,
		MatFormField,
		MatInputModule,
		MatButtonModule,
		CurrencyPipe,
		MatTableModule,
		MatSortModule,
		NgOptimizedImage,
	],
	templateUrl: "./cart.page.ng.html",
	styleUrl: "./cart.page.scss",
})
export class CartPage {
	#cart = inject(Cart);
	total = toSignal(this.#cart.total$, { requireSync: true });
	items = toSignal(this.#cart.cart$, {
		initialValue: [] as Array<CartItemType>,
	});
	shippingFee = toSignal(
		this.#cart.cart$.pipe(
			map((items) =>
				items.reduce(
					(acc, item) => acc + (10 / 100) * item.length.price * item.quantity,
					0,
				),
			),
		),
		{
			initialValue: 0,
		},
	);

	#remove = new Subject<Model.Wig>();
	#reduce = new Subject<Model.Wig>();
	#add = new Subject<Model.Wig>();

	columns = ["name", "length.price", "quantity", "total"];

	constructor() {
		this.#remove
			.pipe(
				takeUntilDestroyed(),
				switchMap((item) => this.#cart.remove(item.length.id)),
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
