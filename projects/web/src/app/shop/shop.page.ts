import { Component } from "@angular/core";
import { MatSelectModule } from "@angular/material/select";
import { MatSliderModule } from "@angular/material/slider";

@Component({
	selector: "web-shop",
	imports: [MatSliderModule, MatSelectModule],
	templateUrl: "./shop.page.ng.html",
	styleUrl: "./shop.page.scss",
})
export class ShopPage {}
