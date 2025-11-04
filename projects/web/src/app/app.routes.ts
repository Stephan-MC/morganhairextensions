import { Routes } from "@angular/router";
import { wigResolver, wigsResolver } from "shared";

export const routes: Routes = [
	{
		path: "",
		title: "Style without limits",
		pathMatch: "full",
		loadComponent: () =>
			import("./landing/landing.page").then((m) => m.LandingPage),
	},
	{
		path: "cart",
		title: "Your cart, confirm order and checkout",
		loadComponent: () => import("./cart/cart.page").then((m) => m.CartPage),
	},
	{
		path: "shop",
		title:
			"Browse, Explore and discover wigs that fit your unique style from our large collection",
		resolve: {
			wigs: wigsResolver,
		},
		loadComponent: () => import("./shop/shop.page").then((m) => m.ShopPage),
	},
	{
		path: "wig/:wig",
		resolve: {
			wig: wigResolver,
		},
		loadComponent: () => import("./wig/wig.page").then((m) => m.WigPage),
	},
	{
		path: "checkout",
		loadComponent: () =>
			import("./checkout/checkout.page").then((m) => m.CheckoutPage),
	},
];
