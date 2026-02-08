import { Component, inject, signal } from "@angular/core";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import {
	email,
	form,
	FormField,
	minLength,
	required,
	submit,
} from "@angular/forms/signals";
import { firstValueFrom, map, catchError, of } from "rxjs";
import { Contact } from "shared";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
	selector: "web-contact",
	imports: [MatInputModule, MatButtonModule, FormField],
	templateUrl: "./contact.page.ng.html",
	styleUrl: "./contact.page.scss",
})
export class ContactPage {
	#contactService = inject(Contact);
	form = form(
		signal({
			name: "",
			email: "",
			subject: "",
			message: "",
		}),
		(schema) => {
			required(schema.name, {
				message: "This field is required",
				when: ({ state }) => state.touched(),
			});
			minLength(schema.name, 5, {
				message: "Name too short. Minimum 5 characters",
			});

			required(schema.email, {
				message: "This field is required",
				when: ({ state }) => state.touched(),
			});
			email(schema.email, {
				message: "Invalid email",
			});

			required(schema.subject, {
				message: "This field is required",
				when: ({ state }) => state.touched(),
			});
			minLength(schema.subject, 5, {
				message: "Subject too short. Minimum 5 characters",
			});

			required(schema.message, {
				message: "This field is required",
				when: ({ state }) => state.touched(),
			});
			minLength(schema.message, 10, {
				message: "Message too short. Minimum 10 characters",
			});
		},
	);

	submit(event: Event) {
		event.preventDefault();
		submit(this.form, async () => {
			return await firstValueFrom(
				this.#contactService.store(this.form().value()).pipe(
					map(() => undefined),
					catchError((error: HttpErrorResponse) => {
						const a = of(
							Object.entries(
								error.error.errors as {
									[k in keyof typeof form]: Array<string>;
								},
							).flatMap(([key, value]: [string, any]) =>
								(value as Array<string>).map((message, k) => ({
									fieldTree: this.form[key as keyof typeof form],
									kind: String(k),
									message,
								})),
							),
						);

						console.log(firstValueFrom(a));

						return a;
					}),
				),
			);
		});
	}
}
