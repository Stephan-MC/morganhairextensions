import { Component, input } from "@angular/core";
import { Model } from "../../types";

@Component({
	selector: "morgan-thumbnail",
	imports: [],
	templateUrl: "./thumbnail.ng.html",
	styleUrl: "./thumbnail.css",
})
export class Thumbnail {
	loading = input<"lazy" | "eager">("lazy");
	src = input.required<string, Model.Media | File | null | string>({
		transform: (value) => {
			if (value instanceof File) {
				return URL.createObjectURL(value);
			} else if (
				typeof value === "object" &&
				Object.hasOwn(value || {}, "url")
			) {
				return (value as Model.Media).url;
			} else if (typeof value === "string" && value.length > 0) {
				return value as string;
			} else {
				// if value is undefined, null or empty string
				return "/assets/images/morgan-hair-circular-flyer.jpeg";
			}
		},
	});
}
