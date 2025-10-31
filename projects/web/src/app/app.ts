import { Component, signal } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { RouterOutlet } from "@angular/router";

@Component({
	selector: "web-root",
	imports: [RouterOutlet, MatIconModule],
	templateUrl: "./app.html",
	styleUrl: "./app.scss",
})
export class App {
	protected readonly title = signal("web");
}
