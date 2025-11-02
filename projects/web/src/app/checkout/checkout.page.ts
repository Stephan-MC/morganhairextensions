import { Component, inject } from "@angular/core";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";

@Component({
	selector: "web-checkout",
	imports: [
		MatInputModule,
		MatButtonModule,
		ReactiveFormsModule,
		MatFormFieldModule,
	],
	templateUrl: "./checkout.page.ng.html",
	styleUrl: "./checkout.page.scss",
})
export class CheckoutPage {
	private _fb = inject(FormBuilder);

	form = this._fb.group({});
}
