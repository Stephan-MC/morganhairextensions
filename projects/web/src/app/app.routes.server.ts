import { RenderMode, ServerRoute } from "@angular/ssr";

export const serverRoutes: ServerRoute[] = [
	{
		path: "",
		renderMode: RenderMode.Server,
	},
	{
		path: "shop",
		renderMode: RenderMode.Server,
	},
	{
		path: "wig/**",
		renderMode: RenderMode.Server,
	},
	{
		path: "**",
		renderMode: RenderMode.Prerender,
	},
];
