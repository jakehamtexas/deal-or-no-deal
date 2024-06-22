import { config } from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

config({ path: ".dev.env" });

const postgresUrl = `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DB}`;

const queryClient = postgres(postgresUrl);

export const db = drizzle(queryClient, { schema });

export type PageDbRow = typeof schema.page.$inferSelect;
export const page = schema.page;
export { eq } from "drizzle-orm";
