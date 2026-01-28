import { Routes } from "@angular/router";
import { wigResolver, wigsResolver } from "shared";

export const routes: Routes = [
	{
		path: "",
		loadComponent: () => import("./home/home.page").then((m) => m.HomePage),
	},
	{
		path: "wigs",
		children: [
			{
				path: "",
				resolve: {
					wigs: wigsResolver,
				},
				loadComponent: () => import("./wigs/wigs.page").then((m) => m.WigsPage),
			},
			{
				path: "create",
				loadComponent: () =>
					import("./wigs/create/create.page").then((m) => m.CreatePage),
			},
			{
				path: ":wig",
				resolve: {
					wig: wigResolver,
				},
				children: [
					{
						path: "",
						loadComponent: () =>
							import("./wigs/create/create.page").then((m) => m.CreatePage),
					},
					{
						path: "edit",
						loadComponent: () =>
							import("./wigs/edit/edit.page").then((m) => m.EditPage),
					},
				],
			},
		],
	},
	{
		path: "orders",
		loadComponent: () =>
			import("./orders/orders.page").then((m) => m.OrdersPage),
	},
];
