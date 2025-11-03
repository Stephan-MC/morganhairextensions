import { CurrencyPipe, NgOptimizedImage } from "@angular/common";
import { Component, input } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSelectModule } from "@angular/material/select";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatSliderModule } from "@angular/material/slider";
import { RouterLink } from "@angular/router";
import { Model, Paginated } from "shared";

@Component({
	selector: "web-shop",
	imports: [
		RouterLink,
		MatButtonModule,
		MatInputModule,
		MatSliderModule,
		MatSelectModule,
		MatPaginatorModule,
		MatSidenavModule,
		CurrencyPipe,
		NgOptimizedImage,
	],
	templateUrl: "./shop.page.ng.html",
	styleUrl: "./shop.page.scss",
})
export class ShopPage {
	wigs = input.required<Paginated<Model.Wig>>();
}
