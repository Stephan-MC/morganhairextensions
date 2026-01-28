import type { HttpErrorResponse } from "@angular/common/http";
import { Component, inject, signal } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import {
	FormField,
	form,
	maxLength,
	minLength,
	required,
	submit,
} from "@angular/forms/signals";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { Router } from "@angular/router";
import { catchError, firstValueFrom, map, of } from "rxjs";
import { Color, HairType, Lace, Source, Texture, Wig } from "shared";

@Component({
	selector: "admin-create",
	imports: [
		FormField,
		MatButtonModule,
		MatDialogModule,
		MatInputModule,
		MatFormFieldModule,
		MatSelectModule,
		MatSlideToggleModule,
	],
	templateUrl: "./create.page.ng.html",
	styleUrl: "./create.page.scss",
})
export class CreatePage {
	#wigService = inject(Wig);
	#router = inject(Router);
	// Services for select options
	textures = toSignal(inject(Texture).textures$, { initialValue: [] });
	hairTypes = toSignal(inject(HairType).hairTypes$, { initialValue: [] });
	sources = toSignal(inject(Source).sources$, { initialValue: [] });
	laces = toSignal(inject(Lace).laces$, { initialValue: [] });
	colors = toSignal(inject(Color).colors$, { initialValue: [] });

	form = form(
		signal({
			name: "",
			featured: false,
			description: "",
			texture_id: "",
			hair_type_id: "",
			source_id: "",
			lace_id: "",
			color_id: "",
		}),
		(tree) => {
			required(tree.name, {
				message: "Enter wig name",
				when: ({ state }) => state.touched(),
			});
			minLength(tree.name, 5, {
				message: "Name too short. Minimum 5 characters",
			});
			maxLength(tree.name, 50, { message: "wig name too long. Maximum 50" });

			required(tree.description, {
				message: "Enter wig description",
				when: ({ state }) => state.touched(),
			});
			minLength(tree.description, 20, {
				message: "description too short. Minimum 20 characters",
			});
			maxLength(tree.description, 500, {
				message: "wig name too long. Maximum 500",
			});

			required(tree.color_id, {
				message: "Select a color",
				when: ({ state }) => state.touched(),
			});

			required(tree.texture_id, {
				message: "Select a Texture",
				when: ({ state }) => state.touched(),
			});

			required(tree.source_id, {
				message: "Select a source",
				when: ({ state }) => state.touched(),
			});

			required(tree.hair_type_id, {
				message: "Select the hairtype",
				when: ({ state }) => state.touched(),
			});
		},
	);

	save(event?: Event) {
		event?.preventDefault();

		submit(this.form, async () => {
			return await firstValueFrom(
				this.#wigService.store(this.form().value()).pipe(
					map(() => undefined),
					catchError((error: HttpErrorResponse) => {
						return of(
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
					}),
				),
			);
		});
	}
}
