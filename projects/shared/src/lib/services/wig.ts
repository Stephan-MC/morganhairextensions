import { inject, Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { ENVIRONMENT } from "../types/environments";
import { Model, Paginated } from "../types";
import { BehaviorSubject, map, shareReplay, switchMap } from "rxjs";

@Injectable({
	providedIn: "root",
})
export class Wig {
	private _http = inject(HttpClient);
	private _environment = inject(ENVIRONMENT);

	params$ = new BehaviorSubject<{ [k: string]: any }>({ page: 1 });

	wigs$ = this.params$.asObservable().pipe(
		map(
			(params) =>
				Object.fromEntries(
					Object.entries(params).filter(
						([_, value]) =>
							Boolean(value) ||
							(typeof value === "string" && Boolean((value as string).trim())),
					),
				) as { [k: string]: string | number },
		),
		switchMap((params) =>
			this._http
				.get<Paginated<Model.Wig>>(`${this._environment.url.api}/wigs`, {
					params: new HttpParams({ fromObject: { page: 1, ...params } }),
				})
				.pipe(),
		),
		shareReplay(1),
	);

	featuredWigs(params: Record<string, number | string> = {}) {
		return this._http.get<Array<Model.Wig>>(
			`${this._environment.url.api}/wigs/featured`,
			{
				params: { limit: 4, new: "", ...params },
			},
		);
	}

	popularWigs(params: Record<string, string | number> = {}) {
		return this._http.get<Array<Model.Wig>>(
			`${this._environment.url.api}/wigs`,
			{
				params: { limit: 4, popular: "", ...params },
			},
		);
	}
}
