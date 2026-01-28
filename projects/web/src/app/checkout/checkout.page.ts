import { HttpClient } from "@angular/common/http";
import { Component, inject, signal } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { FormField, form, required } from "@angular/forms/signals";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatTabsModule } from "@angular/material/tabs";
import {
	catchError,
	map,
	Subject,
	startWith,
	switchMap,
	tap,
	timer,
} from "rxjs";
import { environment } from "../../environments/environment";
import { Cart } from "../common/services/cart";
import { Location } from "@angular/common";

@Component({
	selector: "web-checkout",
	imports: [
		MatInputModule,
		MatButtonModule,
		MatSelectModule,
		MatFormFieldModule,
		MatTabsModule,
		FormField,
	],
	templateUrl: "./checkout.page.ng.html",
	styleUrl: "./checkout.page.scss",
})
export class CheckoutPage {
	#http = inject(HttpClient);
	#cart = inject(Cart);
	formSubject = new Subject<void>();
	data = signal({
		name: "",
		email: "",
		notification_channel: "",
		contact: "",
		address: {
			country: "",
			state: "",
			city: "",
			zip: "",
			line1: "",
			line2: "",
		},
	});

	form = form(
		signal({
			name: "",
			email: "",
			notification_channel: "",
			contact: "",
			address: {
				country: "",
				state: "",
				city: "",
				zip: "",
				line1: "",
				line2: "",
			},
		}),
		(schema) => {
			required(schema.name, {
				message: "Name is required",
				when: ({ state }) => state.touched(),
			});
			required(schema.notification_channel, {
				message: "Notification channel is required",
				when: ({ state }) => state.touched(),
			});
			required(schema.address.country, {
				message: "Country is required",
				when: ({ state }) => state.touched(),
			});
			required(schema.address.state, {
				message: "State is required",
				when: ({ state }) => state.touched(),
			});
			required(schema.address.city, {
				message: "State is required",
				when: ({ state }) => state.touched(),
			});
			required(schema.address.line1, {
				message: "State is required",
				when: ({ state }) => state.touched(),
			});
		},
	);

	cartItems = toSignal(this.#cart.cart$, { initialValue: [] });

	loading = toSignal(
		this.formSubject.asObservable().pipe(
			tap(() => console.log("Submitting form")),
			switchMap(() =>
				this.#http
					.post<{ authorization_url: string }>(`${environment.url.api}/order`, {
						...this.form().value(),
						cart: this.cartItems(),
					})
					.pipe(
						switchMap((res) =>
							timer(300).pipe(
								map(() => false),
								tap(() => {
									window.open(res.authorization_url, "_blank", "popup=true");
								}),
							),
						),
						catchError((error) => {
							return timer(300).pipe(map(() => false));
						}),
						startWith(true),
					),
			),
			startWith(false),
		),
		{ requireSync: true },
	);

	notification_channels = [
		{
			name: "Whatsapp",
			value: "whatsapp",
			icon: "icon-[logos--whatsapp-icon]",
			enabled: false,
		},
		{
			name: "IMessage",
			value: "imessage",
			icon: "icon-[simple-icons--imessage]",
			enabled: true,
		},
		{
			name: "Email",
			value: "email",
			icon: "icon-[entypo--email]",
			enabled: true,
		},
	];
}
