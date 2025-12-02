import { Component, inject } from "@angular/core";
import {
	FormBuilder,
	NonNullableFormBuilder,
	ReactiveFormsModule,
	Validators,
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";

@Component({
	selector: "web-checkout",
	imports: [
		MatInputModule,
		MatButtonModule,
		MatSelectModule,
		ReactiveFormsModule,
		MatFormFieldModule,
	],
	templateUrl: "./checkout.page.ng.html",
	styleUrl: "./checkout.page.scss",
})
export class CheckoutPage {
	#fb = inject(NonNullableFormBuilder);

	form = this.#fb.group({
		name: this.#fb.control<string>("", { validators: [Validators.required] }),
		notification_channel: this.#fb.control("", {
			validators: [Validators.required],
		}),
		notification_contact: this.#fb.control("", {
			validators: [Validators.required],
		}),
		address: this.#fb.record({
			country: this.#fb.control("", { validators: [Validators.required] }),
			state: this.#fb.control("", { validators: [Validators.required] }),
			city: this.#fb.control("", { validators: [Validators.required] }),
			zip: this.#fb.control("", { validators: [Validators.required] }),
			line1: this.#fb.control("", { validators: [Validators.required] }),
			line2: this.#fb.control("", { validators: [] }),
		}),
	});

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
