import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "../prisma";
import { emailOTP } from "better-auth/plugins/email-otp";
import SendOneTimePassword from "@/emails/send-one-time-password";
import VerifyEmail from "@/emails/verify-email";
import ResetPassword from "@/emails/reset-password";

export const auth: ReturnType<typeof betterAuth> = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
     emailOTP({
            async sendVerificationOTP({
                email,
                otp,
                type
            }) {
                if (type === "sign-in") {
                    SendOneTimePassword({ email, otp });
                } else if (type === "email-verification") {
                    VerifyEmail({ email, otp });
                } else {
                    ResetPassword({ email, otp });
            }
        },
    })
  ],
});
