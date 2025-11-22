import { Component, inject } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { RouterLink } from "@angular/router";
import { HairType, Wig } from "shared";
import { toSignal } from "@angular/core/rxjs-interop";
import { CurrencyPipe } from "@angular/common";
import { switchMap } from "rxjs";
import { WigCard } from "../common/components/wig-card/wig-card";

@Component({
	selector: "web-landing",
	imports: [MatButtonModule, MatIconModule, RouterLink, CurrencyPipe, WigCard],
	templateUrl: "./landing.page.ng.html",
	styleUrl: "./landing.page.scss",
})
export class LandingPage {
	private _wigService = inject(Wig);
	private _hairTypeService = inject(HairType);

	featuredWigs = toSignal(this._wigService.featuredWigs());
	hairTypes = toSignal(this._hairTypeService.hairTypes$);
	popularWigs = toSignal(
		this._hairTypeService.hairTypes$.pipe(
			switchMap(() => this._wigService.popularWigs()),
		),
	);
}
