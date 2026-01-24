import { Component, inject, viewChild, type TemplateRef } from "@angular/core";
import { type Model, Wig } from "shared";
import { takeUntilDestroyed, toSignal } from "@angular/core/rxjs-interop";
import { filter, map, shareReplay, Subject, switchMap, tap } from "rxjs";
import { CurrencyPipe } from "@angular/common";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";

@Component({
	selector: "admin-wigs",
	imports: [
		CurrencyPipe,
		MatPaginatorModule,
		MatButtonModule,
		MatIconModule,
		MatInputModule,
		MatDialogModule,
		RouterLink,
	],
	templateUrl: "./wigs.page.ng.html",
	styleUrl: "./wigs.page.scss",
})
export class WigsPage {
	#wigService = inject(Wig);
	#route = inject(ActivatedRoute);
	#dialog = inject(MatDialog);
	router = inject(Router);
	deleteSubject = new Subject<Model.Wig>();
	delete$ = this.deleteSubject.asObservable().pipe(shareReplay());
	template = viewChild.required<TemplateRef<unknown>>("confirmationDialog");

	wigs = toSignal(
		this.#wigService.wigs$.pipe(map((response) => response.data)),
		{
			initialValue: [],
		},
	);
	meta = toSignal(
		this.#wigService.wigs$.pipe(map((response) => response.meta)),
	);

	computedStock(wig: Model.Wig) {
		return wig.lengths.reduce((acc, length) => acc + length.stock, 0);
	}

	constructor() {
		this.#route.queryParams
			.pipe(
				takeUntilDestroyed(),
				tap((params) => this.#wigService.params$.next(params)),
			)
			.subscribe();

		this.deleteSubject
			.asObservable()
			.pipe(
				takeUntilDestroyed(),
				switchMap((wig) =>
					this.#dialog
						.open(this.template(), {
							disableClose: true,
							data: wig,
						})
						.afterClosed()
						.pipe(
							filter((result) => !!result),
							switchMap(() => this.#wigService.delete(wig.slug)),
						),
				),
			)
			.subscribe();
	}
}
