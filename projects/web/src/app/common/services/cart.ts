import { isPlatformServer } from "@angular/common";
import { inject, Injectable, PLATFORM_ID } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { BehaviorSubject, map, mapTo, type Observable, of, tap } from "rxjs";
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

	count$ = this.cart$.pipe(
		map((items) => items.reduce((acc, item) => acc + item.quantity, 0)),
	);
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

	has(wig: Model.Wig, length: Model.Wig.Length): Observable<boolean> {
		const compositeId = `${wig.id}_${length.id}`;
		if (isPlatformServer(this.#platformId)) {
			return of(false);
		}

		return this.cart$.pipe(
			map((items) => items.some((item) => item.id === compositeId)),
		);
	}

	/**
	 * Adds a Wig with a specific length to the cart.
	 * If the combination exists, it updates the quantity.
	 */
	add(wig: Model.Wig, length: Model.Wig.Length): Observable<CartItem> {
		// Create a composite ID: WigID_LengthID
		let item: CartItem;
		const compositeId = `${wig.id}_${length.id}`;
		const currentItems = this.#cart.getValue();
		item = currentItems.find((item) => item.id === compositeId) || {
			...wig,
			id: compositeId,
			length: length,
			quantity: 0,
			added_at: new Date().toISOString(),
		};

		item.quantity += 1;

		// Save to DB, then update State
		return this.#db
			.put<CartItem>(
				this.STORE_NAME,
				{ ...item, quantity: item.quantity + 1 },
				[wig.id, length.id],
			)
			.pipe(
				tap(() => {
					// Update local state
					this.#cart.next([...currentItems, item]);
				}),
			);
	}

	reduce(id: CartItem["id"]) {
		return this.cart$.pipe(
			map((items) =>
				items
					.map((item) =>
						item.id === id ? { ...item, quantity: item.quantity - 1 } : item,
					)
					.filter((item) => item.quantity > 0),
			),
		);
	}

	/**
	 * Remove specific item (Wig + Length combo)
	 */
	remove(cartItemId: string): Observable<string> {
		return this.#db.delete(this.STORE_NAME, cartItemId).pipe(
			tap(() => {
				const filtered = this.#cart
					.getValue()
					.filter((i) => i.id !== cartItemId);
				this.#cart.next(filtered);
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
