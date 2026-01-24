import { isPlatformServer } from "@angular/common";
import { HttpClient, type HttpErrorResponse } from "@angular/common/http";
import { inject, PLATFORM_ID } from "@angular/core";
import { Router, type ResolveFn } from "@angular/router";
import { catchError, EMPTY } from "rxjs";
import { Wig } from "../services";
import { ENVIRONMENT, type Model, type Paginated } from "../types";

export const wigResolver: ResolveFn<Model.Wig | undefined> = (route, state) => {
	const environment = inject(ENVIRONMENT);
	const http = inject(HttpClient);
	const platformId = inject(PLATFORM_ID);
	const router = inject(Router);
	const wigService = inject(Wig);

	if (isPlatformServer(platformId)) {
		return undefined;
	}

	// return wigService.wig$;
	return http
		.get<Model.Wig>(`${environment.url.api}/wig/${route.params["wig"]}`)
		.pipe(
			catchError((error: HttpErrorResponse) => {
				if (error.status === 404) {
					router.navigate(["/wig", "not-found"], { skipLocationChange: true });
				}

				return EMPTY;
			}),
		);
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
