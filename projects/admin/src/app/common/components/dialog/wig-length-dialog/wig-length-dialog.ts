import { Component, DestroyRef, inject, signal } from "@angular/core";
import { MatInputModule } from "@angular/material/input";
import {
	Field,
	form,
	min,
	minLength,
	submit,
	validate,
} from "@angular/forms/signals";
import {
	MAT_DIALOG_DATA,
	MatDialogModule,
	MatDialogRef,
} from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import {
	HttpClient,
	HttpErrorResponse,
	httpResource,
} from "@angular/common/http";
import { environment } from "../../../../../environments/environment";
import { MatSelectModule } from "@angular/material/select";
import {
	catchError,
	firstValueFrom,
	map,
	merge,
	shareReplay,
	Subject,
	switchMap,
	take,
	tap,
	throwError,
} from "rxjs";
import { Model, Thumbnail, Wig } from "shared";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { MatCardModule } from "@angular/material/card";

@Component({
	selector: "admin-wig-length-dialog",
	imports: [
		MatInputModule,
		MatDialogModule,
		Field,
		MatButtonModule,
		MatSelectModule,
		MatCardModule,
		Thumbnail,
	],
	templateUrl: "./wig-length-dialog.ng.html",
	styleUrl: "./wig-length-dialog.scss",
})
export class WigLengthDialog {
	dialogRef = inject(MatDialogRef<WigLengthDialog>);

	#data = inject<{
		id: string;
		length: Model.Wig["length"] | undefined;
		lengths: Array<Model.Wig.Length>;
	}>(MAT_DIALOG_DATA);
	#length = this.#data.length;
	#http = inject(HttpClient);
	#destroyRef = inject(DestroyRef);
	#wigService = inject(Wig);

	wigId = this.#data.id;
	cover = this.#length?.thumbnail || null;
	thumbnails = this.#length?.gallery || [];
	#update = new Subject<void>();
	#save = new Subject<void>();
	isUpdating = signal(!!this.#length?.id, {
		debugName: "LenthUpdateOrCreate",
	});
	lengths = signal(this.#data.lengths || []);

	form = form(
		signal({
			data: "",
			length_id: this.#data.lengths.at(0)?.id || "",
			stock: this.#length?.stock || 0,
			price: this.#length?.price || 0,
			thumbnail: null as Model.Media | File | null,
			gallery: [] as Array<File>,
		}),
		(tree) => {
			min(tree.price, 10, { message: "Enter a valid price" });
			minLength(tree.gallery, 1);
			validate(tree.thumbnail, ({ value }) => {
				if (
					!this.isUpdating() &&
					!(
						value() instanceof File ||
						(!!value() && "url" in (value() as Model.Media))
					)
				) {
					return {
						kind: "media",
						message: "Please select a valid media file",
					};
				}

				return null;
			});
		},
	);

	handleGalleryUpload(event: Event) {
		this.form
			.gallery()
			.value.update((files) => [
				...files,
				...(((event.target as HTMLInputElement).files || []) as Array<File>),
			]);
	}

	onSubmit(event?: Event) {
		event?.preventDefault();

		submit(this.form, async () => {
			this.isUpdating() ? this.#update.next() : this.#save.next();

			const request$ = this.isUpdating()
				? this.#wigService.updateLength(
						this.wigId,
						this.#length!.length_id,
						this.form().value(),
					)
				: this.#wigService.addLength(this.wigId, this.form().value());

			return await firstValueFrom(
				request$.pipe(
					map(() => undefined),
					tap((wig) => this.dialogRef.close(wig)),
					catchError((error: HttpErrorResponse) => {
						console.log("error", error);
						return throwError(() => error);
					}),
				),
			);
		});
	}
}
