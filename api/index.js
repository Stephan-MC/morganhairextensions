export default async (req, res) =>
	await import("../dist/web/server/server.mjs").then((m) =>
		m.reqHandler(req, res),
	);
