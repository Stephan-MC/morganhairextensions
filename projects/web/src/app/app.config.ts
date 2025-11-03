import {
	ApplicationConfig,
	provideBrowserGlobalErrorListeners,
	provideZonelessChangeDetection,
} from "@angular/core";
import { provideRouter, withComponentInputBinding } from "@angular/router";
import { environment } from "../environments/environment";

import {
	provideHttpClient,
	withFetch,
	withInterceptors,
} from "@angular/common/http";
import {
	provideClientHydration,
	withEventReplay,
} from "@angular/platform-browser";
import { routes } from "./app.routes";
import { ENVIRONMENT } from "shared";

export const appConfig: ApplicationConfig = {
	providers: [
		provideBrowserGlobalErrorListeners(),
		provideZonelessChangeDetection(),
		provideRouter(routes, withComponentInputBinding()),
		provideClientHydration(withEventReplay()),
		provideHttpClient(withFetch(), withInterceptors([])),
		{
			provide: ENVIRONMENT,
			useValue: environment,
		},
	],
};
