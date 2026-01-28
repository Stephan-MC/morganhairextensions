import { Component, signal } from "@angular/core";
import { RouterLink, RouterOutlet } from "@angular/router";
import { MatSidenavModule } from "@angular/material/sidenav";

@Component({
	selector: "admin-root",
	imports: [RouterOutlet, MatSidenavModule, RouterLink],
	templateUrl: "./app.ng.html",
	styleUrl: "./app.scss",
})
export class App {
	protected readonly title = signal("admin");
}
