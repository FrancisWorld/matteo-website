import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

const AUTH_SECRET = "pixel-secret-123";

const checkSecret = (secret: string) => {
    if (secret !== AUTH_SECRET) throw new Error("Unauthorized");
};

// Helper to validate table names
const isValidTable = (table: string) => {
  return ["users", "sessions", "accounts", "verifications"].includes(table);
};

export const create = mutation({
  args: {
    table: v.string(),
    data: v.any(),
    secret: v.string(),
  },
  handler: async (ctx, { table, data, secret }) => {
    checkSecret(secret);
    if (!isValidTable(table)) throw new Error("Invalid table");
    // @ts-ignore
    const id = await ctx.db.insert(table, data);
    // Return original data (with its ID) plus the internal Convex ID as _id
    return { ...data, _id: id };
  },
});

export const get = query({
  args: {
    table: v.string(),
    id: v.string(),
    secret: v.string(),
  },
  handler: async (ctx, { table, id, secret }) => {
    checkSecret(secret);
    if (!isValidTable(table)) throw new Error("Invalid table");
    // We assume 'id' here is the Better Auth ID, so we use the index
    // @ts-ignore
    const doc = await ctx.db.query(table).withIndex("by_auth_id", q => q.eq("id", id)).first();
    if (!doc) return null;
    const { _id, _creationTime, ...rest } = doc as any;
    // ensure we return the Better Auth ID as 'id'
    return { ...rest, id: rest.id };
  },
});

export const update = mutation({
  args: {
    table: v.string(),
    id: v.string(),
    data: v.any(),
    secret: v.string(),
  },
  handler: async (ctx, { table, id, data, secret }) => {
    checkSecret(secret);
    if (!isValidTable(table)) throw new Error("Invalid table");
    // @ts-ignore
    const existing = await ctx.db.query(table).withIndex("by_auth_id", q => q.eq("id", id)).first();
    if (!existing) return null;
    
    // @ts-ignore
    await ctx.db.patch(existing._id, data);
    // @ts-ignore
    const doc = await ctx.db.get(existing._id);
    const { _id, _creationTime, ...rest } = doc as any;
    return { ...rest, id: rest.id };
  },
});

export const deleteRow = mutation({
  args: {
    table: v.string(),
    id: v.string(),
    secret: v.string(),
  },
  handler: async (ctx, { table, id, secret }) => {
    checkSecret(secret);
    if (!isValidTable(table)) throw new Error("Invalid table");
    // @ts-ignore
    const existing = await ctx.db.query(table).withIndex("by_auth_id", q => q.eq("id", id)).first();
    if (existing) {
        // @ts-ignore
        await ctx.db.delete(existing._id);
    }
  },
});

export const find = query({
  args: {
    table: v.string(),
    where: v.any(),
    secret: v.string(),
  },
  handler: async (ctx, { table, where, secret }) => {
    checkSecret(secret);
    if (!isValidTable(table)) throw new Error("Invalid table");
    
    // @ts-ignore
    let query = ctx.db.query(table);

    const keys = Object.keys(where);
    if (keys.length === 0) return null;

    let result = null;

    if (where.id && keys.length === 1) {
        // @ts-ignore
        result = await query.withIndex("by_auth_id", q => q.eq("id", where.id)).first();
    }
    else if (table === "users" && where.email && keys.length === 1) {
       // @ts-ignore
       result = await query.withIndex("by_email", (q: any) => q.eq("email", where.email)).first();
    }
    else if (table === "sessions" && where.token && keys.length === 1) {
       // @ts-ignore
       result = await query.withIndex("by_token", (q: any) => q.eq("token", where.token)).first();
    }
    else if (table === "accounts" && where.providerId && where.accountId && keys.length === 2) {
       // @ts-ignore
       result = await query.withIndex("by_provider_account", (q: any) => 
         q.eq("providerId", where.providerId).eq("accountId", where.accountId)
       ).first();
    }
    else {
      const docs = await query.collect();
      // @ts-ignore
      result = docs.find((doc: any) => {
        for (const [k, v] of Object.entries(where)) {
          if (doc[k] !== v) return false;
        }
        return true;
      });
    }

    if (!result) return null;
    const { _id, _creationTime, ...rest } = result as any;
    return { ...rest, id: rest.id };
  },
});

export const findAll = query({
  args: {
    table: v.string(),
    where: v.any(),
    secret: v.string(),
  },
  handler: async (ctx, { table, where, secret }) => {
    checkSecret(secret);
    if (!isValidTable(table)) throw new Error("Invalid table");
    
    // @ts-ignore
    let query = ctx.db.query(table);
    const docs = await query.collect();
    
    // @ts-ignore
    const matches = docs.filter((doc: any) => {
        for (const [k, v] of Object.entries(where)) {
          if (doc[k] !== v) return false;
        }
        return true;
    });

    return matches.map((d: any) => {
        const { _id, _creationTime, ...rest } = d;
        return { ...rest, id: rest.id };
    });
  }
});
