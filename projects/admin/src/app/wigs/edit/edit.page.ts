import { CommonModule } from "@angular/common";
import {
	ChangeDetectionStrategy,
	Component,
	DestroyRef,
	inject,
	input,
	linkedSignal,
	TemplateRef,
	viewChild,
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { Color, HairType, Lace, Model, Source, Texture, Wig } from "shared";
import { takeUntilDestroyed, toSignal } from "@angular/core/rxjs-interop";
import {
	FormField,
	form,
	maxLength,
	minLength,
	required,
} from "@angular/forms/signals";
import {
	MatDialog,
	MatDialogModule,
	MatDialogRef,
} from "@angular/material/dialog";
import { MatCardModule } from "@angular/material/card";
import { WigLengthDialog } from "../../common/components/dialog/wig-length-dialog/wig-length-dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { filter, Subject, switchMap, tap } from "rxjs";
import { httpResource } from "@angular/common/http";
import { environment } from "../../../environments/environment";

@Component({
	selector: "admin-edit-page",
	templateUrl: "./edit.page.ng.html",
	styleUrls: ["./edit.page.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [
		CommonModule,
		MatFormFieldModule,
		MatInputModule,
		MatSelectModule,
		MatSlideToggleModule,
		MatButtonModule,
		FormField,
		MatCardModule,
		MatDialogModule,
	],
})
export class EditPage {
	#dialogRef!: MatDialogRef<any>;
	#router = inject(Router);
	#route = inject(ActivatedRoute);
	#destroyRef = inject(DestroyRef);
	#wigService = inject(Wig);
	#lengths = httpResource<Array<Model.Wig.Length>>(
		() => ({
			url: `${environment.url.api}/lengths`,
		}),
		{
			defaultValue: [],
		},
	);
	private template = viewChild.required<TemplateRef<any>>(
		"lengthDeleteConfirmation",
	);
	delete = new Subject<Model.Wig["length"]>();

	wig = input.required<Model.Wig>();
	wigLengths = linkedSignal(() => this.wig().lengths);
	#lengthsMap = linkedSignal(
		() => new Map(this.wig().lengths.map((l) => [l.length_id, l])),
	);

	private readonly dialog = inject(MatDialog);

	// Services for select options
	textures = toSignal(inject(Texture).textures$, { initialValue: [] });
	hairTypes = toSignal(inject(HairType).hairTypes$, { initialValue: [] });
	sources = toSignal(inject(Source).sources$, { initialValue: [] });
	laces = toSignal(inject(Lace).laces$, { initialValue: [] });
	colors = toSignal(inject(Color).colors$, { initialValue: [] });

	model = linkedSignal(() => ({
		id: this.wig()?.id || "",
		name: this.wig()?.name || "",
		description: this.wig()?.description || "",
		texture_id: this.wig()?.texture.id || "",
		hair_type_id: this.wig()?.hair_type.id || "",
		source_id: this.wig()?.source.id || "",
		lace_id: this.wig()?.lace.id || "",
		color_id: this.wig()?.color.id || "",
	}));

	form = form(this.model, (tree) => {
		required(tree.name, {
			message: "Enter wig name",
			when: ({ state }) => state.touched(),
		});
		minLength(tree.name, 7, {
			message: "Name too short. Minimum 7 characters",
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
	});

	constructor() {
		this.delete
			.asObservable()
			.pipe(
				takeUntilDestroyed(),
				switchMap((length) =>
					this.dialog
						.open(this.template(), {
							disableClose: true,
							data: length,
						})
						.afterClosed()
						.pipe(
							filter((result) => !!result),
							switchMap(() =>
								this.#wigService.removeLength(
									this.wig().slug,
									length.length_id,
								),
							),
							tap(() => {
								this.wigLengths.update((lengths) =>
									lengths.filter((l) => l.id !== length.id),
								);
							}),
						),
				),
			)
			.subscribe();
	}

	openLengthEditModal(length?: Model.Wig["length"]) {
		this.#dialogRef = this.dialog.open(WigLengthDialog, {
			data: {
				id: this.wig()!.slug,
				length,
				lengths: this.#lengths
					.value()
					.filter((length) => !this.#lengthsMap().has(length.id)),
			},
			minWidth: 300,
		});

		this.#dialogRef
			.afterClosed()
			.pipe(takeUntilDestroyed(this.#destroyRef))
			.subscribe((result: Model.Wig.Length) => {
				this.#router.navigate(["./"], {
					onSameUrlNavigation: "reload",
					relativeTo: this.#route,
				});
			});
	}

	save() {
		console.log("Saving form data");
	}
}
