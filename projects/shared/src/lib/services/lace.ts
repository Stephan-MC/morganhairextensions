import { inject, Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { ENVIRONMENT, Model } from "../types";
import { BehaviorSubject, map, switchMap } from "rxjs";

@Injectable({
	providedIn: "root",
})
export class Lace {
	private _http = inject(HttpClient);
	private _environment = inject(ENVIRONMENT);
	params = new BehaviorSubject<{ [k: string]: any }>({ page: 1 });

	params$ = this.params.asObservable();
	laces$ = this.params$.pipe(
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
				.get<Array<Model.Wig.Lace>>(`${this._environment.url.api}/laces`, {
					params: new HttpParams({ fromObject: params }),
				})
				.pipe(),
		),
	);
}
