export default async (req, res) =>
	await import("../dist/admin/server/server.mjs").then((m) =>
		m.reqHandler(req, res),
	);
