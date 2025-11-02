import { Routes } from "@angular/router";

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
		loadComponent: () => import("./shop/shop.page").then((m) => m.ShopPage),
	},
	{
		path: "checkout",
		loadComponent: () =>
			import("./checkout/checkout.page").then((m) => m.CheckoutPage),
	},
];
