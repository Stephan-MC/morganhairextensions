import { Component, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { RouterLink } from "@angular/router";
import { Cart } from "../common/services/cart";
import { toSignal } from "@angular/core/rxjs-interop";
import type { CartItem as CartItemType } from "shared";
import { CartItem } from "../common/components/cart-item/cart-item";
import { AsyncPipe } from "@angular/common";

@Component({
	selector: "web-cart",
	imports: [AsyncPipe, RouterLink, MatButtonModule, CartItem],
	templateUrl: "./cart.page.ng.html",
	styleUrl: "./cart.page.scss",
})
export class CartPage {
	cart = inject(Cart);
	items = toSignal(this.cart.cart$, {
		initialValue: [] as Array<CartItemType>,
	});

	removeItem(id: string) {
		this.cart.remove(id);
	}
}
