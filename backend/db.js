import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();
const connectionString = process.env.DATABASE_URL || "postgresql://amazing:zi86qL5qFO8kQ2V2w0rA2LhFPBgMO9lX@dpg-d4v946ali9vc73dji0qg-a.oregon-postgres.render.com/foodsystem_db";

const isLocal =
  connectionString &&
  !connectionString.includes("render.com") &&
  (connectionString.includes("localhost") ||
    connectionString.includes("127.0.0.1") ||
    connectionString.startsWith("postgresql://postgres:") ||
    connectionString.startsWith("postgres://postgres:"));

const poolConfig = connectionString
  ? {
      connectionString,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000
    }
  : null;

if (poolConfig && !isLocal) {
  poolConfig.ssl = {
    require: true,
    rejectUnauthorized: false
  };
}

export const pool = poolConfig ? new Pool(poolConfig) : null;

if (connectionString) {
  console.log(`Database connection: ${isLocal ? "LOCAL" : "REMOTE"}`);
  console.log(
    isLocal
      ? "Using local PostgreSQL (SSL disabled)"
      : "Using remote PostgreSQL (SSL enabled)"
  );
} else {
  console.log("Database connection: NOT CONFIGURED (DATABASE_URL not set)");
}

if (pool) {
  pool.on("error", (err) => {
    console.error("Unexpected error on idle client", err);
    process.exit(-1);
  });

  pool
    .query("select now()")
    .then(() => {
      console.log("Database connected successfully");
    })
    .catch((err) => {
      console.error("Database connection error:", err?.message || String(err));
    });
}

export async function dbHealth() {
  if (!pool) return { ok: false, reason: "DATABASE_URL not set" };
  try {
    await pool.query("select 1 as ok");
    return { ok: true };
  } catch (err) {
    return { ok: false, reason: err?.message || String(err) };
  }
}

export async function dbQuery(text, params = []) {
  if (!pool) {
    const e = new Error("DATABASE_URL not set (Postgres is not configured)");
    e.code = "DB_NOT_CONFIGURED";
    throw e;
  }
  return pool.query(text, params);
}


