import { isPlatformServer } from "@angular/common";
import { Injectable, inject, PLATFORM_ID } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { BehaviorSubject, map, type Observable, of, tap } from "rxjs";
import { type CartItem, DB, type Model } from "shared";

@Injectable({
	providedIn: "root",
})
export class Cart {
	#db = inject(DB);
	#platformId = inject(PLATFORM_ID);
	private readonly STORE_NAME = "cart";

	// In-memory state for reactive UI updates
	#cart = new BehaviorSubject<CartItem[]>([]);
	public cart$ = this.#cart.asObservable();

	count$ = this.cart$.pipe(map((items) => items.length));
	subtotal$ = this.cart$.pipe(
		map((items) =>
			items.reduce((acc, item) => {
				return acc + item.length.price * item.quantity;
			}, 0),
		),
	);
	total$ = this.cart$.pipe(
		map((items) =>
			items.reduce((acc, item) => {
				return acc + item.length.price * item.quantity;
			}, 0),
		),
	);

	constructor() {
		this.#db
			.getAll<CartItem>(this.STORE_NAME)
			.pipe(takeUntilDestroyed())
			.subscribe({
				next: (items) => this.#cart.next(items),
				error: (err) => console.error("Failed to load cart", err),
			});
	}

	has(id: Model.Wig.Length["id"]) {
		if (isPlatformServer(this.#platformId)) {
			return of(false);
		}

		return this.cart$.pipe(
			map((items) => items.some((item) => item.id === id)),
		);
	}

	/**
	 * Adds a Wig with a specific length to the cart.
	 * If the combination exists, it updates the quantity.
	 */
	add(wig: Model.Wig): Observable<CartItem> {
		// Create a composite ID: WigID_LengthID
		let item: CartItem | undefined;
		const currentItems = this.#cart.getValue();
		item = currentItems.find((item) => item.id === wig.length.id);

		if (item === undefined) {
			item = {
				...wig,
				id: wig.length.id,
				quantity: 0,
				added_at: new Date().toISOString(),
			};

			currentItems.push(item);
		}

		++(item as CartItem).quantity;

		// Save to DB, then update State
		return this.#db.put<CartItem>(this.STORE_NAME, item).pipe(
			tap(() => {
				// Update local state
				this.#cart.next(currentItems);
			}),
		);
	}

	reduce(id: CartItem["length"]["id"]): Observable<CartItem[]> {
		const currentItems = this.#cart.getValue();
		const itemIndex = currentItems.findIndex((item) => item.id === id);

		if (itemIndex === -1) {
			return of([...currentItems]); // Item not found, return current cart
		}

		const itemToUpdate = { ...currentItems[itemIndex] };
		itemToUpdate.quantity--;

		if (itemToUpdate.quantity <= 0) {
			// Remove item from cart and DB
			currentItems.splice(itemIndex, 1);
			return this.#db
				.delete(this.STORE_NAME, [itemToUpdate.id, itemToUpdate.length.id])
				.pipe(
					tap(() => {
						this.#cart.next([...currentItems]); // Notify subscribers of change
					}),
					map(() => currentItems),
				);
		} else {
			// Update item quantity in cart and DB
			currentItems[itemIndex] = itemToUpdate;
			return this.#db.put<CartItem>(this.STORE_NAME, itemToUpdate).pipe(
				tap(() => {
					this.#cart.next([...currentItems]); // Notify subscribers of change
				}),
				map(() => currentItems),
			);
		}
	}

	/**
	 * Remove specific item (Wig + Length combo)
	 */
	remove(id: Model.Wig.Length["id"]) {
		const currentItems = this.#cart.getValue();

		const item = currentItems.find((item) => item.id === id);

		const key = item !== undefined ? [id] : [];

		return this.#db.delete(this.STORE_NAME, key).pipe(
			tap((key) => {
				console.log("Removal key is : ", key);
				this.#cart.next(currentItems.filter((item) => item.id !== id));
			}),
		);
	}

	/**
	 * Clear entire cart
	 */
	clear(): Observable<void> {
		return this.#db.clear(this.STORE_NAME).pipe(tap(() => this.#cart.next([])));
	}
}
