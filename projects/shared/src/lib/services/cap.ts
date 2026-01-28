import { Injectable, inject } from "@angular/core";
import { ENVIRONMENT, Model } from "../types";
import { BehaviorSubject, map, switchMap } from "rxjs";
import { HttpClient, HttpParams } from "@angular/common/http";

@Injectable({
	providedIn: "root",
})
export class Cap {
	#http = inject(HttpClient);
	#environment = inject(ENVIRONMENT);
	params = new BehaviorSubject<{ [k: string]: any }>({ page: 1 });

	params$ = this.params.asObservable();
	caps$ = this.params$.pipe(
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
			this.#http
				.get<Array<Model.Wig.Lace>>(`${this.#environment.url.api}/partings`, {
					params: new HttpParams({ fromObject: params }),
				})
				.pipe(),
		),
	);
}
