import { isPlatformBrowser, isPlatformServer } from "@angular/common";
import { inject, Injectable, PLATFORM_ID } from "@angular/core";
import {
	BehaviorSubject,
	filter,
	from,
	mergeMap,
	Observable,
	Subject,
} from "rxjs";

@Injectable({
	providedIn: "root",
})
export class DB {
	private dbName = "wigs";
	private version = 1;
	#db = new BehaviorSubject<IDBDatabase | null>(null);
	db$ = this.#db.asObservable();
	#platformId = inject(PLATFORM_ID);

	private schema: Array<
		{
			storeName: string;
			indices?: Array<string>;
		} & IDBObjectStoreParameters
	> = [
		{
			storeName: "cart",
			keyPath: ["id", "length.id"],
		},
		{
			storeName: "favorites",
			keyPath: "id",
		},
	];

	constructor() {
		this.init();
	}

	init() {
		if (isPlatformServer(this.#platformId)) {
			console.warn("indexedDB not supported in this environment");
			return;
		}

		const request = indexedDB.open(this.dbName, this.version);

		request.onerror = (event) => {
			console.log("IDB error", event);
			this.#db.error(event);
		};

		request.onsuccess = (event: Event) => {
			console.log("Hellow World");
			this.#db.next((event.target as IDBOpenDBRequest).result);
		};

		// This handles "Update Compatible" requirement.
		// Runs when version number increases or DB is created.
		request.onupgradeneeded = (event) => {
			const db = (event.target as IDBOpenDBRequest)?.result;

			this.schema.forEach((storeConfig) => {
				if (!db.objectStoreNames.contains(storeConfig.storeName)) {
					const store = db.createObjectStore(storeConfig.storeName, {
						keyPath: storeConfig.keyPath,
					});

					// Create indices if defined
					storeConfig.indices?.forEach((idx) => {
						store.createIndex(idx, idx, { unique: false });
					});
				}
			});
		};
	}

	/**
	 * Helper to get the DB instance via RxJS
	 */
	private getDb(): Observable<IDBDatabase | null> {
		return this.#db.asObservable();
	}

	/**
	 * Generic Add/Update method (put)
	 */
	put<T>(storeName: string, value: T, key?: IDBValidKey): Observable<T> {
		return this.db$.pipe(
			filter((db) => db !== null),
			mergeMap((db) => {
				return new Observable<T>((observer) => {
					const transaction = db.transaction([storeName], "readwrite");
					const store = transaction.objectStore(storeName);
					const request = store.put(value, key);

					request.onsuccess = () => {
						observer.next(value);
						observer.complete();
					};

					request.onerror = (err) => observer.error(err);
				});
			}),
		);
	}

	/**
	 * Generic Get All method
	 */
	getAll<T>(storeName: string): Observable<T[]> {
		return this.db$.pipe(
			filter((db) => db !== null),
			mergeMap((db) => {
				return new Observable<T[]>((observer) => {
					const transaction = db.transaction([storeName], "readonly");
					const store = transaction.objectStore(storeName);
					const request = store.getAll();

					request.onsuccess = () => {
						observer.next(request.result);
						observer.complete();
					};

					request.onerror = (err) => observer.error(err);
				});
			}),
		);
	}

	/**
	 * Generic Delete method
	 */
	delete(storeName: string, key: string): Observable<string> {
		return this.db$.pipe(
			filter((db) => db !== null),
			mergeMap((db) => {
				return new Observable<string>((observer) => {
					const transaction = db.transaction([storeName], "readwrite");
					const store = transaction.objectStore(storeName);
					const request = store.delete(key);

					request.onsuccess = () => {
						observer.next(key);
						observer.complete();
					};

					request.onerror = (err) => observer.error(err);
				});
			}),
		);
	}

	/**
	 * Generic Clear Store
	 */
	clear(storeName: string): Observable<void> {
		return this.db$.pipe(
			filter((db) => db !== null),
			mergeMap((db) => {
				return new Observable<void>((observer) => {
					const transaction = db.transaction([storeName], "readwrite");
					const store = transaction.objectStore(storeName);
					const request = store.clear();

					request.onsuccess = () => {
						observer.next();
						observer.complete();
					};

					request.onerror = (err) => observer.error(err);
				});
			}),
		);
	}
}
