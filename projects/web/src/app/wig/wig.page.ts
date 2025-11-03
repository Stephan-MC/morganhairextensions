import { Component, input } from "@angular/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatTabsModule } from "@angular/material/tabs";
import { Model } from "shared";

@Component({
	selector: "web-wig",
	imports: [MatTabsModule, MatFormFieldModule, MatSelectModule],
	templateUrl: "./wig.page.ng.html",
	styleUrl: "./wig.page.scss",
})
export class WigPage {
	wig = input.required<Model.Wig>();
}
