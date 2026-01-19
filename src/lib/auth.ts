import { betterAuth } from "better-auth";
import { admin, emailOTP } from "better-auth/plugins";
import { createTransport } from "nodemailer";
import { convexAdapter } from "./convex-adapter";
import {
	ac,
	adminRole,
	creatorRole,
	moderatorRole,
	userRole,
} from "./permissions";

const transporter = createTransport({
	host: process.env.SMTP_HOST || "smtp.gmail.com",
	port: Number(process.env.SMTP_PORT) || 587,
	secure: false,
	auth: {
		user: process.env.SMTP_USER,
		pass: process.env.SMTP_PASS,
	},
});

const sendEmail = async ({
	to,
	subject,
	text,
	html,
}: {
	to: string;
	subject: string;
	text: string;
	html: string;
}) => {
	if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
		console.log("----------------------------------------");
		console.log("📧 MOCK EMAIL (No SMTP Configured)");
		console.log(`To: ${to}`);
		console.log(`Subject: ${subject}`);
		console.log(`Body: ${text}`);
		console.log("----------------------------------------");
		return;
	}

	try {
		await transporter.sendMail({
			from: `"Matteo" <${process.env.SMTP_USER}>`,
			to,
			subject,
			text,
			html,
		});
		console.log(`📧 Email sent to ${to}`);
	} catch (error) {
		console.error("Failed to send email:", error);
	}
};

export const auth = betterAuth({
	database: convexAdapter(),
	plugins: [
		admin({
			ac,
			roles: {
				admin: adminRole,
				moderator: moderatorRole,
				creator: creatorRole,
				user: userRole,
			},
		}),
		emailOTP({
			otpLength: 6,
			expiresIn: 600,
			sendVerificationOTP: async ({ email, otp, type }) => {
				const typeLabels: Record<string, string> = {
					"email-verification": "verificar seu e-mail",
					"sign-in": "fazer login",
					"forget-password": "redefinir sua senha",
				};

				const html = `
          <div style="font-family: 'Courier New', monospace; background-color: #121212; color: #e0e0e0; padding: 20px; border: 4px solid #55aa55; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #55aa55; text-align: center; text-transform: uppercase; letter-spacing: 2px;">Código de Verificação</h1>
            <p>Use o código abaixo para ${typeLabels[type] || "continuar"}:</p>
            <div style="text-align: center; margin: 30px 0;">
              <div style="background-color: #1a1a1a; border: 4px solid #55aa55; padding: 20px; display: inline-block;">
                <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #55aa55;">${otp}</span>
              </div>
            </div>
            <p style="font-size: 14px; color: #888; text-align: center;">Este código expira em 10 minutos.</p>
            <p style="font-size: 12px; color: #666; text-align: center; margin-top: 20px;">Se você não solicitou isso, ignore este e-mail.</p>
          </div>
        `;

				await sendEmail({
					to: email,
					subject: `Seu código: ${otp} - Mundo do Matteo`,
					text: `Seu código de verificação é: ${otp}. Válido por 10 minutos.`,
					html,
				});
			},
		}),
	],
	emailAndPassword: {
		enabled: true,
		requireEmailVerification: true,
	},
	user: {
		additionalFields: {
			firstName: {
				type: "string",
				required: false,
			},
			lastName: {
				type: "string",
				required: false,
			},
			minecraftUsername: {
				type: "string",
				required: false,
			},
		},
	},
	socialProviders: {
		github: {
			clientId: process.env.GITHUB_CLIENT_ID!,
			clientSecret: process.env.GITHUB_CLIENT_SECRET!,
		},
	},
	trustedOrigins: ["http://localhost:3000", "http://localhost:5173"],
});
