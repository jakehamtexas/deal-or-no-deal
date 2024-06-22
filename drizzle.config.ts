import { defineConfig } from "drizzle-kit";
import { config } from "dotenv";

config({ path: ".dev.env" });

export default defineConfig({
  dialect: "postgresql",
  schema: "./db/schema.ts",
  out: "./db/migrations/",
  dbCredentials: {
    user: process.env.POSTGRES_USER as string,
    password: process.env.POSTGRES_PASSWORD as string,
    host: process.env.POSTGRES_HOST as string,
    port: Number(process.env.POSTGRES_PORT),
    database: process.env.POSTGRES_DB as string,
  },
});
