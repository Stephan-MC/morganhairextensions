import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { BehaviorSubject, map, switchMap } from "rxjs";
import { Paginated, Model, ENVIRONMENT } from "../types";

@Injectable({
	providedIn: "root",
})
export class HairType {
	private _http = inject(HttpClient);
	private _environment = inject(ENVIRONMENT);
	params$ = new BehaviorSubject<{ [k: string]: any }>({ page: 1 });

	hairTypes$ = this.params$.asObservable().pipe(
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
				.get<Array<Model.Wig.HairType>>(
					`${this._environment.url.api}/hair-types`,
					{
						params: new HttpParams({ fromObject: params }),
					},
				)
				.pipe(),
		),
	);
}
