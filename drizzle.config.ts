import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";
import path from "path";
dotenv.config();

export default {
  schema: "./shared/schema.ts",
  out: "./drizzle",
  dialect: "sqlite",
  dbCredentials: {
    url: path.join(process.cwd(), "dhenu.db"),
  },
} satisfies Config;
