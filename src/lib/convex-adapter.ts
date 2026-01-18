import { createAdapterFactory } from "better-auth/adapters";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../convex/_generated/api";

const mapTable = (model: string) => {
	const map: Record<string, string> = {
		user: "users",
		session: "sessions",
		account: "accounts",
		verification: "verifications",
	};
	return map[model] || model;
};

const mapWhere = (where: any[]) => {
	const obj: any = {};
	for (const w of where) {
		obj[w.field] = w.value;
	}
	return obj;
};

const mapDataToConvex = (data: any) => {
	const newData: any = { ...data };
	for (const key in newData) {
		if (newData[key] instanceof Date) {
			newData[key] = newData[key].getTime();
		}
		if (newData[key] === undefined) {
			delete newData[key]; // Convex doesn't support undefined
		}
	}
	return newData;
};

const mapDataFromConvex = (data: any) => {
	if (!data) return null;
	const newData: any = { ...data };
	for (const key in newData) {
		// Check if the key corresponds to a date field based on typical Better Auth fields
		// or heuristic: if it's a number and looks like a timestamp?
		// Safer to rely on known date fields.
		if (
			[
				"createdAt",
				"updatedAt",
				"expiresAt",
				"accessTokenExpiresAt",
				"refreshTokenExpiresAt",
			].includes(key)
		) {
			if (typeof newData[key] === "number") {
				newData[key] = new Date(newData[key]);
			}
		}
	}
	return newData;
};

const SECRET = "pixel-secret-123";

export const convexAdapter = (options?: { client?: ConvexHttpClient }) => {
	const convexUrl = process.env.VITE_CONVEX_URL || process.env.CONVEX_URL;
	if (!convexUrl && !options?.client) {
		console.warn("Missing CONVEX_URL env variable for convexAdapter");
	}
	const client = options?.client || new ConvexHttpClient(convexUrl!);

	return createAdapterFactory({
		config: { adapterId: "convex", ...options },
		adapter: () => {
			return {
				id: "convex",
				create: async ({ model, data }) => {
					const res = await client.mutation(api.auth.create, {
						table: mapTable(model),
						data: mapDataToConvex(data),
						secret: SECRET,
					});
					return mapDataFromConvex(res);
				},
				findOne: async ({ model, where }) => {
					const res = await client.query(api.auth.find, {
						table: mapTable(model),
						where: mapWhere(where),
						secret: SECRET,
					});
					return mapDataFromConvex(res);
				},
				findMany: async ({ model, where }) => {
					const docs = await client.query(api.auth.findAll, {
						table: mapTable(model),
						where: where ? mapWhere(where) : {},
						secret: SECRET,
					});
					return docs.map(mapDataFromConvex);
				},
				update: async ({ model, where, update }) => {
					const w = mapWhere(where);
					const updateData = mapDataToConvex(update);

					if (w.id) {
						const res = await client.mutation(api.auth.update, {
							table: mapTable(model),
							id: w.id,
							data: updateData,
							secret: SECRET,
						});
						return mapDataFromConvex(res);
					}
					const doc = await client.query(api.auth.find, {
						table: mapTable(model),
						where: w,
						secret: SECRET,
					});
					if (!doc) return null;
					const res = await client.mutation(api.auth.update, {
						table: mapTable(model),
						id: doc.id,
						data: updateData,
						secret: SECRET,
					});
					return mapDataFromConvex(res);
				},
				delete: async ({ model, where }) => {
					const w = mapWhere(where);
					if (w.id) {
						await client.mutation(api.auth.deleteRow, {
							table: mapTable(model),
							id: w.id,
							secret: SECRET,
						});
						return;
					}
					const doc = await client.query(api.auth.find, {
						table: mapTable(model),
						where: w,
						secret: SECRET,
					});
					if (doc) {
						await client.mutation(api.auth.deleteRow, {
							table: mapTable(model),
							id: doc.id,
							secret: SECRET,
						});
					}
				},
				deleteMany: async ({ model, where }) => {
					const w = where ? mapWhere(where) : {};
					const docs = await client.query(api.auth.findAll, {
						table: mapTable(model),
						where: w,
						secret: SECRET,
					});
					for (const doc of docs) {
						await client.mutation(api.auth.deleteRow, {
							table: mapTable(model),
							id: doc.id,
							secret: SECRET,
						});
					}
					return docs.length;
				},
				updateMany: async ({ model, where, update }) => {
					const w = where ? mapWhere(where) : {};
					const updateData = mapDataToConvex(update);
					const docs = await client.query(api.auth.findAll, {
						table: mapTable(model),
						where: w,
						secret: SECRET,
					});
					let count = 0;
					for (const doc of docs) {
						await client.mutation(api.auth.update, {
							table: mapTable(model),
							id: doc.id,
							data: updateData,
							secret: SECRET,
						});
						count++;
					}
					return count;
				},
				count: async ({ model, where }) => {
					const w = where ? mapWhere(where) : {};
					const docs = await client.query(api.auth.findAll, {
						table: mapTable(model),
						where: w,
						secret: SECRET,
					});
					return docs.length;
				},
			};
		},
	});
};
