"use node";

import { internalAction } from "./_generated/server";
import { v } from "convex/values";
import nodemailer from "nodemailer";
import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";

export const sendRegistrationEmail = internalAction({
  args: {
    email: v.string(),
    name: v.string(),
    groupName: v.string(),
  },
  handler: async (ctx, args) => {
    const sesClient = new SESv2Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });

    const transporter = nodemailer.createTransport({
      SES: {
        sesClient: sesClient, 
        SendEmailCommand,
      },
    });

    try {
      const { name, groupName, email } = args;
      await transporter.sendMail({
        from: "cloud@polpocr.com",
        to: email,
        subject: "Bienvenido a la comunidad de Orosi",
        html: `
          <div style="font-family: sans-serif; padding: 20px;">
            <h1>Hola ${name}</h1>
            <p>Te has inscrito exitosamente al grupo: <strong>${groupName}</strong>.</p>
            <p>Esperamos verte pronto.</p>
          </div>
        `,
      });
      console.log(`Correo enviado a ${email}`);
    } catch (error) {
      console.error("Error enviando correo:", error);
    }
  },
});