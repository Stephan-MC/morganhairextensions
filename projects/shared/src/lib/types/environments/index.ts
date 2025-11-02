import { InjectionToken } from "@angular/core";

export interface ENVIRONMENT extends Record<string, any> {
	url: {
		base: string;
		api: string;
	};
	production: boolean;
}

export const ENVIRONMENT = new InjectionToken<ENVIRONMENT>("ENVIRONMENT");
