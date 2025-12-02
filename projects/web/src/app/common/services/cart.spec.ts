import { TestBed } from "@angular/core/testing";
import { BehaviorSubject, Observable, of } from "rxjs";
import { Cart } from "./cart";
import { DB, CartItem, Model } from "shared";

class MockDB {
	private store: { [key: string]: CartItem } = {};

	getAll<T>(storeName: string): Observable<T[]> {
		return of(Object.values(this.store) as T[]);
	}

	put<T extends { id: string }>(storeName: string, item: T): Observable<T> {
		this.store[item.id] = item as any;
		return of(item);
	}

	delete(storeName: string, id: string): Observable<string> {
		delete this.store[id];
		return of(id);
	}

	clear(storeName: string): Observable<void> {
		this.store = {};
		return of(undefined);
	}

	// Helper for tests to set initial state
	setInitialStore(items: CartItem[]) {
		this.store = items.reduce((acc, item) => ({ ...acc, [item.id]: item }), {});
	}
}

describe("Cart", () => {
	let service: Cart;
	let mockDb: MockDB;

	const mockWigLength: Model.Wig.Length = {
		id: "length1",
		value: 18,
		price: 100,
	};

	const mockWig: Model.Wig = {
		id: "wig1",
		name: "Test Wig",
		description: "A beautiful test wig",
		color: { id: "color1", name: "Black", value: "#000" },
		hairType: { id: "type1", name: "Virgin" },
		lace: { id: "lace1", name: "HD" },
		length: mockWigLength,
		source: { id: "source1", name: "Peruvian" },
		texture: { id: "texture1", name: "Straight" },
		image: "wig1.jpg",
	};

	const mockCartItem: CartItem = {
		...mockWig,
		quantity: 1,
		added_at: new Date().toISOString(),
	};

	beforeEach(() => {
		mockDb = new MockDB();
		TestBed.configureTestingModule({
			providers: [
				Cart,
				{ provide: DB, useValue: mockDb }, // Provide the mock DB
			],
		});
		service = TestBed.inject(Cart);

		// Manually initialize the cart behavior subject since constructor will call getAll
		// This needs to be done *after* service is injected and mockDb is ready.
		// For a more robust solution, we might want to make Cart's constructor an async operation
		// or expose a method to load from DB. For now, directly setting internal state if possible.
		// However, the real Cart service constructor already handles this by subscribing to getAll.
		// So we just need to ensure mockDb.getAll returns expected values.
	});

	it("should be created", () => {
		expect(service).toBeTruthy();
	});

	describe("add", () => {
		it("should add a new item to the cart", (done) => {
			service.add(mockWig).subscribe((item) => {
				expect(item.id).toBe(mockWig.id);
				expect(item.length.id).toBe(mockWig.length.id);
				expect(item.quantity).toBe(1);

				service.cart$.subscribe((items) => {
					expect(items.length).toBe(1);
					expect(items[0].id).toBe(mockWig.id);
					expect(items[0].quantity).toBe(1);
					done();
				});
			});
		});

		it("should increase quantity if item already exists", (done) => {
			// Add item once
			service.add(mockWig).subscribe(() => {
				// Add same item again
				service.add(mockWig).subscribe((item) => {
					expect(item.quantity).toBe(2);
					service.cart$.subscribe((items) => {
						expect(items.length).toBe(1);
						expect(items[0].quantity).toBe(2);
						done();
					});
				});
			});
		});
	});

	describe("reduce", () => {
		beforeEach(() => {
			mockDb.setInitialStore([
				{ ...mockCartItem, quantity: 2 },
				{ ...mockCartItem, id: "wig2", quantity: 1 },
			]);
			// Re-initialize cart after setting initial store for tests
			// This simulates the constructor loading items.
			(service as any).#cart = new BehaviorSubject<CartItem[]>([
				{ ...mockCartItem, quantity: 2 },
				{ ...mockCartItem, id: "wig2", quantity: 1 },
			]);
		});

		it("should reduce the quantity of an existing item", (done) => {
			service.reduce(mockWig.id, mockWigLength.id).subscribe((items) => {
				expect(items.length).toBe(2);
				expect(items[0].id).toBe(mockWig.id);
				expect(items[0].quantity).toBe(1);

				service.cart$.subscribe((cartItems) => {
					expect(cartItems[0].quantity).toBe(1);
					done();
				});
			});
		});

		it("should remove the item if quantity becomes 0 or less", (done) => {
			service.reduce(mockWig.id, mockWigLength.id).subscribe(() => {
				// Quantity is now 1, reduce again to make it 0
				service.reduce(mockWig.id, mockWigLength.id).subscribe((items) => {
					expect(items.length).toBe(1); // Only wig2 should remain
					expect(items[0].id).toBe("wig2");

					service.cart$.subscribe((cartItems) => {
						expect(cartItems.length).toBe(1);
						expect(cartItems[0].id).toBe("wig2");
						done();
					});
				});
			});
		});

		it("should not do anything if the item does not exist", (done) => {
			const nonExistentId = "nonExistent";
			service.reduce(nonExistentId, mockWigLength.id).subscribe((items) => {
				expect(items.length).toBe(2); // Cart should remain unchanged
				service.cart$.subscribe((cartItems) => {
					expect(cartItems.length).toBe(2);
					expect(cartItems[0].id).toBe(mockWig.id);
					done();
				});
			});
		});
	});

	describe("remove", () => {
		beforeEach(() => {
			mockDb.setInitialStore([mockCartItem]);
			(service as any).#cart = new BehaviorSubject<CartItem[]>([mockCartItem]);
		});

		it("should remove a specific item from the cart", (done) => {
			service.remove(mockCartItem.id).subscribe((removedId) => {
				expect(removedId).toBe(mockCartItem.id);
				service.cart$.subscribe((items) => {
					expect(items.length).toBe(0);
					done();
				});
			});
		});

		it("should not remove anything if the item does not exist", (done) => {
			const nonExistentId = "nonExistent";
			service.remove(nonExistentId).subscribe(() => {
				service.cart$.subscribe((items) => {
					expect(items.length).toBe(1); // Cart should remain unchanged
					done();
				});
			});
		});
	});

	describe("clear", () => {
		beforeEach(() => {
			mockDb.setInitialStore([mockCartItem]);
			(service as any).#cart = new BehaviorSubject<CartItem[]>([mockCartItem]);
		});

		it("should clear all items from the cart", (done) => {
			service.clear().subscribe(() => {
				service.cart$.subscribe((items) => {
					expect(items.length).toBe(0);
					done();
				});
			});
		});
	});

	describe("has", () => {
		beforeEach(() => {
			mockDb.setInitialStore([mockCartItem]);
			(service as any).#cart = new BehaviorSubject<CartItem[]>([mockCartItem]);
		});

		it("should return true if the item exists in the cart", (done) => {
			service.has(mockWig, mockWigLength).subscribe((result) => {
				expect(result).toBeTrue();
				done();
			});
		});

		it("should return false if the item does not exist in the cart", (done) => {
			const nonExistentWig: Model.Wig = {
				...mockWig,
				id: "nonExistentWig",
			};
			service.has(nonExistentWig, mockWigLength).subscribe((result) => {
				expect(result).toBeFalse();
				done();
			});
		});
	});

	describe("computed properties", () => {
		const item1: CartItem = { ...mockCartItem, quantity: 1, length: { ...mockWigLength, price: 50 } };
		const item2: CartItem = { ...mockCartItem, id: "wig2", quantity: 2, length: { ...mockWigLength, price: 25 } };

		beforeEach(() => {
			mockDb.setInitialStore([item1, item2]);
			(service as any).#cart = new BehaviorSubject<CartItem[]>([item1, item2]);
		});

		it("count$ should return the total quantity of items", (done) => {
			service.count$.subscribe((count) => {
				expect(count).toBe(3); // 1 + 2
				done();
			});
		});

		it("subtotal$ should return the correct sum of item prices", (done) => {
			service.subtotal$.subscribe((subtotal) => {
				expect(subtotal).toBe(item1.quantity * item1.length.price + item2.quantity * item2.length.price); // 1*50 + 2*25 = 100
				done();
			});
		});

		it("total$ should return the correct sum of item prices (same as subtotal in this context)", (done) => {
			service.total$.subscribe((total) => {
				expect(total).toBe(item1.quantity * item1.length.price + item2.quantity * item2.length.price); // 1*50 + 2*25 = 100
				done();
			});
		});
	});
});