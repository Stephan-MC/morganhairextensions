import { Component, inject, signal } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { Color, HairType, Lace, Source, Texture } from "shared";
import {
	form,
	FormField,
	maxLength,
	minLength,
	required,
} from "@angular/forms/signals";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatDialogModule } from "@angular/material/dialog";
import { MatSelectModule } from "@angular/material/select";
import { MatInputModule } from "@angular/material/input";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";

@Component({
	selector: "admin-create",
	imports: [
		FormField,
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

	save() {}
}
