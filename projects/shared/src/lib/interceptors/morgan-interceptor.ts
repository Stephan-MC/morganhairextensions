import { isPlatformServer } from "@angular/common";
import {
	HttpClient,
	type HttpInterceptorFn,
	HttpXsrfTokenExtractor,
} from "@angular/common/http";
import { inject, PLATFORM_ID } from "@angular/core";
import { catchError, EMPTY, switchMap } from "rxjs";
import { Cookie } from "../services";
import { ENVIRONMENT } from "../types";
import { HTTP_SKIP_ON_SERVER } from "../contexts";

export const morganInterceptor: HttpInterceptorFn = (req, next) => {
	const platformId = inject(PLATFORM_ID);
	const isServer = isPlatformServer(platformId);
	const environment = inject(ENVIRONMENT);
	const cookies = inject(Cookie);
	const http = inject(HttpClient);
	const xsrfTokenExtractor = inject(HttpXsrfTokenExtractor);
	const isApiRequest = new RegExp(
		`^https?://${environment.url.api.replace(/https?:\/\//, "")}`,
	).test(req.url);

	console.log("is api request", isApiRequest);

	if (req.context.get(HTTP_SKIP_ON_SERVER) === true && isServer) {
		return EMPTY;
		// return next(req).pipe(catchError(() => EMPTY));
	}

	if (!/\/csrf$/.test(req.url) && isServer) {
		return next(req).pipe(catchError(() => EMPTY));
	}

	if (isApiRequest && !/\/csrf$/.test(req.url)) {
		const token = xsrfTokenExtractor.getToken();

		if (token) {
			return next(
				req.clone({
					setHeaders: { "X-XSRF-TOKEN": token },
					withCredentials: true,
				}),
			);
		}

		return http
			.get<void>(`${environment.url.api}/csrf`, {
				withCredentials: true,
			})
			.pipe(
				switchMap(() =>
					next(
						req.clone({
							withCredentials: true,
							setHeaders: {
								"X-XSRF-TOKEN": String(xsrfTokenExtractor.getToken()),
							},
						}),
					),
				),
			);
	}

	return next(req);
};
