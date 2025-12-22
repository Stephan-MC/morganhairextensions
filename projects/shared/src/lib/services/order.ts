import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ENVIRONMENT } from "../types/environments";
import { map, shareReplay } from "rxjs";
import { Model, Paginated } from "../types";

@Injectable({
	providedIn: "root",
})
export class Order {
	#http = inject(HttpClient);
	#environment = inject(ENVIRONMENT);

	orders$ = this.#http
		.get<
			Paginated<Model.Order> & {
				extra: {
					pending_count: number;
				};
			}
		>(`${this.#environment.url.api}/orders`)
		.pipe(shareReplay());
	total$ = this.orders$.pipe(map((response) => response.meta.total));
}
