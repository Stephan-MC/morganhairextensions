import { Component } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { RouterLink } from "@angular/router";

@Component({
	selector: "web-cart",
	imports: [RouterLink, MatButtonModule],
	templateUrl: "./cart.page.ng.html",
	styleUrl: "./cart.page.scss",
})
export class CartPage {}
