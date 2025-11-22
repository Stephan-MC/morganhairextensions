import { Injectable } from "@angular/core";
import { from, mergeMap, Observable, Subject } from "rxjs";

@Injectable({
	providedIn: "root",
})
export class DB {
	private dbName = "wigs";
	private version = 1;
	private dbSubject = new Subject<IDBDatabase>();

	private schema: Array<
		{
			storeName: string;
			indices?: Array<string>;
		} & IDBObjectStoreParameters
	> = [
		{
			storeName: "cart",
			keyPath: "id",
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
		const request = indexedDB.open(this.dbName, this.version);

		request.onerror = (event) => {
			console.log("IDB error", event);
			this.dbSubject.error(event);
		};

		request.onsuccess = (event: any) => {
			const db = event.target.result;
			this.dbSubject.next(db);
		};

		// This handles "Update Compatible" requirement.
		// Runs when version number increases or DB is created.
		request.onupgradeneeded = (event) => {
			const db: IDBDatabase = (event.target as any)?.result;

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
	private getDb(): Observable<IDBDatabase> {
		return this.dbSubject.asObservable();
	}

	/**
	 * Generic Add/Update method (put)
	 */
	put<T>(storeName: string, value: T): Observable<T> {
		return this.getDb().pipe(
			mergeMap((db) => {
				return new Observable<T>((observer) => {
					const transaction = db.transaction([storeName], "readwrite");
					const store = transaction.objectStore(storeName);
					const request = store.put(value);

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
		return this.getDb().pipe(
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
		return this.getDb().pipe(
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
		return this.getDb().pipe(
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
