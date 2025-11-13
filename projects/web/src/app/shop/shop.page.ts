import { CurrencyPipe, NgOptimizedImage } from "@angular/common";
import { Component, inject, input } from "@angular/core";
import { takeUntilDestroyed, toSignal } from "@angular/core/rxjs-interop";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatChipsModule } from "@angular/material/chips";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSelectModule } from "@angular/material/select";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatSliderModule } from "@angular/material/slider";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { tap } from "rxjs";
import {
	Color,
	HairType,
	Model,
	Paginated,
	Source,
	Texture,
	Wig,
} from "shared";

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
		MatChipsModule,
		ReactiveFormsModule,
	],
	templateUrl: "./shop.page.ng.html",
	styleUrl: "./shop.page.scss",
})
export class ShopPage {
	#route = inject(ActivatedRoute);
	#fb = inject(FormBuilder);
	#router = inject(Router);
	private _hairTypeService = inject(HairType);
	private _textureService = inject(Texture);
	private _sourceService = inject(Source);
	private _colorService = inject(Color);
	private _wigService = inject(Wig);

	wigService = inject(Wig);
	hairTypes = toSignal(this._hairTypeService.hairTypes$);
	wigs = toSignal(this.wigService.wigs$, { requireSync: true });
	colors = toSignal(this._colorService.colors$, { initialValue: [] });
	textures = toSignal(this._textureService.textures$, { initialValue: [] });
	sources = toSignal(this._sourceService.sources$, { initialValue: [] });
	lengths = Array.from({ length: 14 }).map((_, i) => 6 + i * 2);

	form = this.#fb.group({
		page: this.#fb.control<number>(this.#route.snapshot.queryParams["page"], {
			nonNullable: true,
		}),
		q: this.#fb.control(this.#route.snapshot.queryParams["q"], {
			nonNullable: true,
		}),
		color: this.#fb.control(this.#route.snapshot.queryParams["color"], {}),
		source: this.#fb.control(this.#route.snapshot.queryParams["source"], {}),
		length: this.#fb.control(this.#route.snapshot.queryParams["length"], {}),
		texture: this.#fb.control(this.#route.snapshot.queryParams["texture"], {}),
		hair_type: this.#fb.control(
			this.#route.snapshot.queryParams["hair_type"],
			{},
		),
		price: this.#fb.record({
			min: this.#fb.control(
				this.#route.snapshot.queryParams["price_min"] || 0,
				{},
			),
			max: this.#fb.control(this.#route.snapshot.queryParams["price_max"], {
				updateOn: "blur",
			}),
		}),
	});

	constructor() {
		this.#route.queryParams
			.pipe(
				takeUntilDestroyed(),
				tap((queryParams) => this.wigService.params$.next(queryParams)),
			)
			.subscribe();

		this.form.valueChanges
			.pipe(
				takeUntilDestroyed(),
				tap((queryParams) =>
					this.#router.navigate(this.#route.snapshot.url, { queryParams }),
				),
				tap(() => {
					console.log(this.form.getRawValue());
				}),
			)
			.subscribe();
	}
}
