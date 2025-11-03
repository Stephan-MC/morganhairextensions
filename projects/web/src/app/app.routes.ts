import { Routes } from "@angular/router";
import { wigResolver, wigsResolver } from "shared";

export const routes: Routes = [
	{
		path: "",
		pathMatch: "full",
		loadComponent: () =>
			import("./landing/landing.page").then((m) => m.LandingPage),
	},
	{
		path: "cart",
		loadComponent: () => import("./cart/cart.page").then((m) => m.CartPage),
	},
	{
		path: "shop",
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
