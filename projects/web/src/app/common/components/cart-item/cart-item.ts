import { CurrencyPipe } from "@angular/common";
import {
	ChangeDetectionStrategy,
	Component,
	inject,
	input,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { MatFormField, MatInputModule } from "@angular/material/input";
import { Subject, switchMap } from "rxjs";
import type { CartItem as CartItemType } from "shared";
import { Cart } from "../../services/cart";

@Component({
	selector: "web-cart-item",
	imports: [CurrencyPipe, MatInputModule, MatFormField],
	templateUrl: "./cart-item.ng.html",
	styleUrl: "./cart-item.scss",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartItem {
	cart = inject(Cart);
	item = input.required<CartItemType>();
	#remove = new Subject<void>();
	#reduce = new Subject<void>();
	#add = new Subject<void>();

	constructor() {
		this.#remove
			.pipe(
				takeUntilDestroyed(),
				switchMap(() => this.cart.remove(this.item().id)),
			)
			.subscribe();

		this.#add
			.pipe(
				takeUntilDestroyed(),
				switchMap(() => this.cart.add(this.item())),
			)
			.subscribe();

		this.#reduce
			.pipe(
				takeUntilDestroyed(),
				switchMap(() => this.cart.reduce(this.item().length.id)),
			)
			.subscribe();
	}

	removeItem() {
		this.#remove.next();
	}

	increment() {
		this.#add.next();
	}

	decrement() {
		this.#reduce.next();
	}
}
