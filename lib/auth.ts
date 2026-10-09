import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";
import { MongoClient } from "mongodb";

// Reuse one client across hot reloads in dev. MongoClient connects lazily, so build works without a DB.
const g = globalThis as unknown as { _mongoClient?: MongoClient };
const client =
  g._mongoClient ??
  new MongoClient(process.env.MONGODB_URI ?? 'http://localhost:3000');
if (process.env.NODE_ENV !== "production") g._mongoClient = client;
const db = client.db(process.env.MONGODB_DB || "bazardor");

const socialProviders: Record<string, { clientId: string; clientSecret: string }> = {};
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  socialProviders.google = {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  };
}
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  socialProviders.github = {
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
  };
}

export const auth = betterAuth({
  database: mongodbAdapter(db),
  // autoSignIn false => after sign up the user is sent to the login page (assignment requirement)
  emailAndPassword: { enabled: true, autoSignIn: false },
  socialProviders,
  plugins: [nextCookies()],
});
