import { ResolveFn } from "@angular/router";
import { ENVIRONMENT, Model, Paginated } from "../types";
import { inject, PLATFORM_ID } from "@angular/core";
import { isPlatformServer } from "@angular/common";
import { Wig } from "../services";
import { HttpClient } from "@angular/common/http";

export const wigResolver: ResolveFn<Model.Wig | undefined> = (route, state) => {
	const environment = inject(ENVIRONMENT);
	const http = inject(HttpClient);
	const platformId = inject(PLATFORM_ID);

	if (isPlatformServer(platformId)) {
		return undefined;
	}

	return http
		.get<Model.Wig>(`${environment.url.api}/wig/${route.params["wig"]}`)
		.pipe();
};

export const wigsResolver: ResolveFn<Paginated<Model.Wig>> = (route, state) => {
	const wigService = inject(Wig);

	wigService.params$.next(
		Object.fromEntries(
			Object.entries(route.queryParams).filter(([key]) =>
				[
					"color",
					"texture",
					"length",
					"source",
					"hair_type",
					"page",
					"lace",
				].includes(key.toLowerCase()),
			),
		),
	);

	return wigService.wigs$.pipe();
};
