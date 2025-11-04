import { CurrencyPipe, NgOptimizedImage } from "@angular/common";
import { Component, inject, input } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatFormField, MatInputModule } from "@angular/material/input";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSelectModule } from "@angular/material/select";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatSliderModule } from "@angular/material/slider";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { tap } from "rxjs";
import { Model, Paginated, Wig } from "shared";

@Component({
	selector: "web-shop",
	imports: [
		RouterLink,
		MatButtonModule,
		MatInputModule,
		MatFormFieldModule,
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
	private _route = inject(ActivatedRoute);
	private _wigService = inject(Wig);
	wigs = input.required<Paginated<Model.Wig>>();

	constructor() {
		this._route.queryParams.pipe(
			tap((params) => this._wigService.params$.next(params)),
		);
	}
}
