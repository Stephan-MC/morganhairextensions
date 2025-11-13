import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { ENVIRONMENT, Model } from "../types";

@Injectable({
	providedIn: "root",
})
export class Color {
	#http = inject(HttpClient);
	environment = inject(ENVIRONMENT);

	colors$ = this.#http.get<Array<Model.Wig.Color>>(
		`${this.environment.url.api}/colors`,
	);
}
