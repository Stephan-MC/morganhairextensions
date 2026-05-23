import { CurrencyPipe, NgOptimizedImage } from "@angular/common";
import {
	Component,
	effect,
	inject,
	signal,
	type TemplateRef,
	viewChild,
} from "@angular/core";
import { takeUntilDestroyed, toSignal } from "@angular/core/rxjs-interop";
import { FormField, form } from "@angular/forms/signals";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import {
	MatPaginatorModule,
	type PageEvent,
} from "@angular/material/paginator";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { filter, map, Subject, shareReplay, switchMap, tap } from "rxjs";
import { type Model, Wig } from "shared";

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
		FormField,
		NgOptimizedImage,
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

	form = form(signal({ q: "" }), (schema) => {});

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
		effect(() => {
			this.#wigService.params.set({ ...this.form().value() });
		});
		this.#route.queryParams
			.pipe(
				takeUntilDestroyed(),
				tap((params) => this.#wigService.params.set(params)),
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

	handlePaginationEvent(event: PageEvent) {
		if (this.meta()?.current_page !== event.pageIndex) {
			this.#wigService.params.update((value) => ({
				...value,
				page: event.pageIndex + 1,
			}));
		}
	}
}
