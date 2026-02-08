import { inject, Injectable, signal } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { ENVIRONMENT } from "../types/environments";
import type { Model, Paginated } from "../types";
import {
	BehaviorSubject,
	debounceTime,
	filter,
	map,
	shareReplay,
	switchMap,
	tap,
} from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { toFormData } from "../utils";
import { toObservable } from "@angular/core/rxjs-interop";

@Injectable({
	providedIn: "root",
})
export class Wig {
	#http = inject(HttpClient);
	#environment = inject(ENVIRONMENT);
	#route = inject(ActivatedRoute);

	params = signal<{ [k: string]: any }>({ page: 1 });
	params$ = toObservable(this.params);

	wig$ = this.#route.params.pipe(
		filter((params) => !!params["wig"]),
		map((params) => params["wig"] as string),
		switchMap((slug) =>
			this.#http.get<Model.Wig>(`${this.#environment.url.api}/wig/${slug}`),
		),
		shareReplay(1),
	);

	wigs$ = this.params$.pipe(
		debounceTime(400),
		map(
			(params) =>
				Object.fromEntries(
					Object.entries(params).filter(
						([key, value]) =>
							(key === "min_price" && value > 0) ||
							(key === "max_price" && value < 1000) ||
							key === "new" ||
							Boolean(value) ||
							(typeof value === "string" && Boolean((value as string).trim())),
					),
				) as { [k: string]: string | number },
		),
		switchMap((params) =>
			this.#http
				.get<Paginated<Model.Wig>>(`${this.#environment.url.api}/wigs`, {
					params: new HttpParams({ fromObject: { page: 1, ...params } }),
				})
				.pipe(),
		),
		shareReplay(1),
	);
	total$ = this.wigs$.pipe(map((response) => response.meta.total));

	featuredWigs(params: Record<string, number | string> = {}) {
		return this.#http.get<Array<Model.Wig>>(
			`${this.#environment.url.api}/wigs/featured`,
			{
				params: { limit: 4, new: "", ...params },
			},
		);
	}

	popularWigs(params: Record<string, string | number> = {}) {
		return this.#http.get<Array<Model.Wig>>(
			`${this.#environment.url.api}/wigs`,
			{
				params: { limit: 4, popular: "", ...params },
			},
		);
	}

	/**
	 * Save wig data to the database
	 */
	store(data: any) {
		return this.#http.post(`${this.#environment.url.api}/wig`, data);
	}

	delete(slug: Model.Wig["slug"]) {
		return this.#http
			.delete(`${this.#environment.url.api}/wig/${slug.toLowerCase()}`)
			.pipe(tap(() => this.params.update((value) => ({ ...value, page: 1 }))));
	}

	addLength(wig: Model.Wig["id"], data: any) {
		return this.#http
			.post(
				`${this.#environment.url.api}/wig/${wig.toLowerCase()}/length`,
				toFormData(data),
			)
			.pipe();
	}

	updateLength(
		wig: Model.Wig["id"],
		/** The ID of the length associated to the model  */
		length: Model.Wig.Length["id"],
		data: any,
	) {
		return this.#http
			.patch(
				`${this.#environment.url.api}/wig/${wig.toLowerCase()}/length/${length}`,
				toFormData(data),
			)
			.pipe();
	}

	removeLength(wig: Model.Wig["id"], length: Model.Wig["length"]["id"]) {
		return this.#http
			.delete(
				`${this.#environment.url.api}/wig/${wig.toLowerCase()}/length/${length.toLowerCase()}`,
			)
			.pipe();
	}
}
