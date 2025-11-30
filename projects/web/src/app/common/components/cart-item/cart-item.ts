import { AsyncPipe, CurrencyPipe } from "@angular/common";
import {
	ChangeDetectionStrategy,
	Component,
	inject,
	input,
} from "@angular/core";
import type { CartItem as CartItemType } from "shared";
import { Cart } from "../../services/cart";
import { Subject, switchMap } from "rxjs";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { MatFormField, MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";

@Component({
	selector: "web-cart-item",
	imports: [AsyncPipe, CurrencyPipe, MatInputModule, MatFormField],
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
				switchMap(() => this.cart.add(this.item(), this.item().length)),
			)
			.subscribe();

		this.#reduce
			.pipe(
				takeUntilDestroyed(),
				switchMap(() => this.cart.reduce(this.item().id)),
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
