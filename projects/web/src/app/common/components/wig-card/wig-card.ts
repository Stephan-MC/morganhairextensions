import { CurrencyPipe } from "@angular/common";
import {
	ChangeDetectionStrategy,
	Component,
	inject,
	input,
} from "@angular/core";
import { RouterLink } from "@angular/router";
import type { Model } from "shared";
import { Cart } from "../../../cart";

@Component({
	selector: "web-wig-card",
	imports: [CurrencyPipe, RouterLink],
	templateUrl: "./wig-card.ng.html",
	styleUrl: "./wig-card.scss",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WigCard {
	wig = input.required<Model.Wig>();

	#cart = inject(Cart);
}
