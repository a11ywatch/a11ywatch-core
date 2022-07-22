import fs from "fs";
import { replaceDockerNetwork } from "@a11ywatch/website-source-builder";
import { CookieOptions } from "express";

const DEV = process.env.NODE_ENV !== "production";
const TEST_ENV = process.env.NODE_ENV === "test";

let PUBLIC_KEY =
  process.env.PUBLIC_KEY &&
  String(process.env.PUBLIC_KEY).replace(/\\n/gm, "\n");
let PRIVATE_KEY =
  process.env.PRIVATE_KEY &&
  String(process.env.PRIVATE_KEY).replace(/\\n/gm, "\n");

// email key
let EMAIL_CLIENT_KEY =
  process.env.EMAIL_CLIENT_KEY &&
  String(process.env.EMAIL_CLIENT_KEY).replace(/\\n/gm, "\n");

if (!PRIVATE_KEY) {
  try {
    PRIVATE_KEY = fs.readFileSync("./private.key", "utf8");
  } catch (_) {}
}

if (!PUBLIC_KEY) {
  try {
    PUBLIC_KEY = fs.readFileSync("./public.key", "utf8");
  } catch (_) {}
}

if (!EMAIL_CLIENT_KEY && PRIVATE_KEY) {
  EMAIL_CLIENT_KEY = PRIVATE_KEY;
}

const GRAPHQL_PORT = Number(
  process.env.PORT || process.env.GRAPHQL_PORT || 3280
);

// if ran from the CLI prevent rate-limits and usage limits [TODO]
export const SUPER_MODE = process.env.SUPER_MODE === "true";

const defaultWebPort = process.env.WEB_PORT || 3000;
const defaultWebURL = DEV
  ? `http://localhost:${defaultWebPort}`
  : "https://a11ywatch.com";

export const config = {
  DEV,
  DB_URL: process.env.DB_URL || process.env.MONGO_URL,
  DB_NAME: process.env.DB_NAME || "a11ywatch",
  CLIENT_URL: replaceDockerNetwork(process.env.CLIENT_URL),
  GRAPHQL_PORT,
  ROOT_URL: process.env.ROOT_URL || "http://localhost:3280",
  DOMAIN: process.env.DOMAIN ? process.env.DOMAIN : defaultWebURL,
  // EMAIL
  EMAIL_SERVICE_URL: process.env.EMAIL_SERVICE_URL,
  EMAIL_CLIENT_ID: process.env.EMAIL_CLIENT_ID,
  EMAIL_CLIENT_KEY,
  // STRIPE
  STRIPE_KEY: process.env.STRIPE_KEY,
  STRIPE_BASIC_PLAN: process.env.STRIPE_BASIC_PLAN,
  STRIPE_PREMIUM_PLAN: process.env.STRIPE_PREMIUM_PLAN,
  STRIPE_BASIC_PLAN_YEARLY: process.env.STRIPE_BASIC_PLAN_YEARLY,
  STRIPE_PREMIUM_PLAN_YEARLY: process.env.STRIPE_PREMIUM_PLAN_YEARLY,
  SUPER_MODE,
};

let cookieConfigs: CookieOptions = {
  maxAge: 228960000,
  sameSite: "lax",
  httpOnly: true,
  secure: true,
  domain: config.DOMAIN.replace("https://", "."),
};

if (DEV) {
  cookieConfigs = {
    ...cookieConfigs,
    sameSite: false,
    secure: false,
    domain: undefined,
  };
}

export { cookieConfigs, DEV, TEST_ENV, PRIVATE_KEY, PUBLIC_KEY };
