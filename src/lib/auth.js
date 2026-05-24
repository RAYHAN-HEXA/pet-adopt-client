import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { jwt } from 'better-auth/plugins';
import { nextCookies } from 'better-auth/next-js';
import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.DATABASE_URL);
const db = await client.connect().then(() => client.db());

export const auth = betterAuth({
  database: mongodbAdapter(db),
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || process.env.BETTER_AUTH_URL || 'http://localhost:3000',
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
  },
  socialProviders: process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET ? {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
   
  } : {},
  user: {
    additionalFields: {
      role: {
        type: 'string',
        defaultValue: 'ADOPTER',
        required: false,
        input: false,
      },
      phoneNumber: {
        type: 'string',
        required: false,
        input: true,
      },
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      strategy: "jwt",
      maxAge: 7 * 24 * 60 * 60,
    },
  },
  plugins: [
    jwt(),
    nextCookies(),
  ],
  advanced: {
    defaultCookieAttributes: {
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    },
    useSecureCookies: process.env.NODE_ENV === 'production',
    crossSubDomain: {
      enabled: false,
    },
    disableCSRFCheck: true,
  },
});
