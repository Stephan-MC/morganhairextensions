import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { Component, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { map } from "rxjs/operators";
import { Wig, Order } from "shared";
import { toSignal } from "@angular/core/rxjs-interop";
import { MatSidenavModule } from "@angular/material/sidenav";
import { DecimalPipe } from "@angular/common";
import { RouterLink } from "@angular/router";

@Component({
	selector: "admin-home",
	templateUrl: "./home.page.ng.html",
	styleUrl: "./home.page.scss",
	imports: [
		DecimalPipe,
		MatGridListModule,
		MatMenuModule,
		MatIconModule,
		MatButtonModule,
		MatCardModule,
		MatSidenavModule,
		RouterLink,
	],
})
export class HomePage {
	#breakpointObserver = inject(BreakpointObserver);
	#wigService = inject(Wig);
	#orderService = inject(Order);

	wigs = this.#wigService.wigs$;
	total = toSignal(this.wigs.pipe(map((data) => data.meta.total)), {
		initialValue: 0,
	});
	totalOrders = toSignal(this.#orderService.total$, { initialValue: 0 });
	pendingOrder = toSignal(
		this.#orderService.orders$.pipe(
			map((response) => response.extra.pending_count),
		),
	);

	/** Based on the screen size, switch from standard to one column per row */
	cards = this.#breakpointObserver
		.observe([Breakpoints.Handset, Breakpoints.Small])
		.pipe(map(({ matches }) => {}));
}
