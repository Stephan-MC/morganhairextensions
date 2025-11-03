export * from "./environments";
export * from "./models";

export interface Paginated<T = any> {
	data: Array<T>;
	links: {
		first: string | null;
		last: string | null;
		prev: string | null;
		next: string | null;
	};
	meta: {
		/** The current page for which the data is loaded */
		current_page: number;

		/**
		 * The index of the first item on the current page
		 * with respect to the total number of items to be paginated
		 */
		from: number | null;

		/** The index of the last item on the current page */
		to: number | null;

		/** The base path of the request */
		path: string;

		/** The number of items sent per page */
		per_page: number;

		last_page: number;

		/** Total number of items to be paginated */
		total: number;

		links: Array<{
			url: string | null;
			label: string | number;
			page: number | null;
			active: boolean;
		}>;
	};
}

export interface PaginatedWithExtra<T = any, E = any> extends Paginated<T> {
	extra?: E;
}
