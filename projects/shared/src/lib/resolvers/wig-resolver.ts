import { ResolveFn } from "@angular/router";
import { ENVIRONMENT, Model, Paginated } from "../types";
import { inject, PLATFORM_ID } from "@angular/core";
import { isPlatformServer } from "@angular/common";
import { Wig } from "../services";
import { of } from "rxjs";
import { HttpClient } from "@angular/common/http";

export const wigResolver: ResolveFn<Model.Wig | undefined> = (route, state) => {
	const environment = inject(ENVIRONMENT);
	const http = inject(HttpClient);
	const platformId = inject(PLATFORM_ID);

	if (isPlatformServer(platformId)) {
		return undefined;
	}

	return http.get<Model.Wig>(
		`${environment.url.api}/wig/${route.params["wig"]}`,
	);
};

export const wigsResolver: ResolveFn<Paginated<Model.Wig>> = (route, state) => {
	const wigService = inject(Wig);
	const platformId = inject(PLATFORM_ID);

	if (isPlatformServer(platformId)) {
		return of({
			data: [],
			meta: {
				current_page: 0,
				from: 0,
				last_page: 0,
				path: "",
				per_page: 0,
				to: 0,
				total: 0,
				links: [],
			},
			links: { first: null, last: null, prev: null, next: null },
		} as Paginated<Model.Wig>);
	}

	wigService.params$.next(
		Object.fromEntries(
			Object.entries(route.queryParams).filter(([key]) =>
				["color", "texture", "length", "source", "hair_type", "page"].includes(
					key.toLowerCase(),
				),
			),
		),
	);

	return wigService.wigs$.pipe();
};
