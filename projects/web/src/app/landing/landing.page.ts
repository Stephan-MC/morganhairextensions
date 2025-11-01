import { Component } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { RouterLink } from "@angular/router";

@Component({
	selector: "web-landing",
	imports: [MatButtonModule, MatIconModule, RouterLink],
	templateUrl: "./landing.page.ng.html",
	styleUrl: "./landing.page.scss",
})
export class LandingPage {}
