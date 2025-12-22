import { HttpContextToken } from "@angular/common/http";

/**
 * This context helps to determine whether to skip the request on the server side.
 * It can be useful for requests that may need to send browser cookies to backend
 * @default false
 */
export const HTTP_SKIP_ON_SERVER = new HttpContextToken<boolean>(() => false);

/**
 * If true, current user is required to be logged in to access the resource.
 * @default false
 */
export const HTTP_REDIRECT_TO_LOGIN_ON_FAILURE = new HttpContextToken(
	() => false,
);

/**
 * If true, any subsequent interceptors will be skipped.
 * @default false
 */
export const HTTP_SKIP_SUBSEQUENT_INTERCEPTORS = new HttpContextToken(
	() => false,
);
