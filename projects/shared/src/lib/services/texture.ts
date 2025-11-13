import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { BehaviorSubject, map, switchMap } from "rxjs";
import { ENVIRONMENT, Model } from "../types";

@Injectable({
	providedIn: "root",
})
export class Texture {
	private _http = inject(HttpClient);
	private _environment = inject(ENVIRONMENT);
	params = new BehaviorSubject<{ [k: string]: any }>({ page: 1 });

	params$ = this.params.asObservable();
	textures$ = this.params$.pipe(
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
					`${this._environment.url.api}/textures`,
					{
						params: new HttpParams({ fromObject: params }),
					},
				)
				.pipe(),
		),
	);
}
