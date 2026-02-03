"use node";

import { internalAction } from "./_generated/server";
import { v } from "convex/values";
import nodemailer from "nodemailer";

export interface EmailAttachment {
  filename: string;
  content: Buffer | string;
  contentType?: string;
}

export interface EmailOptions {
  to: string;
  bcc?: string[];
  subject: string;
  text: string;
  html: string;
  attachments?: EmailAttachment[];
}

/**
 * Crea y retorna una instancia del transportador de nodemailer
 * Configurado usando variables de entorno
 */
function createTransporter() {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587;
  const smtpUser = process.env.SMTP_USERNAME;
  const smtpPassword = process.env.SMTP_PASSWORD;
  const smtpSecure = process.env.SMTP_SECURE === "true";

  if (!smtpHost || !smtpUser || !smtpPassword) {
    throw new Error(
      "Faltan configuraciones SMTP. Por favor define SMTP_HOST, SMTP_USER y SMTP_PASSWORD."
    );
  }

  const isAwsSes = smtpHost?.includes("amazonaws.com");

  return nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpSecure, // true para 465, false para otros puertos
    auth: {
      user: smtpUser,
      pass: smtpPassword,
    },
    // Configuración específica para AWS SES
    ...(isAwsSes && {
      requireTLS: !smtpSecure,
      tls: {
        rejectUnauthorized: false,
        minVersion: "TLSv1.2",
      },
      // Aumentar tiempos para AWS SES ya que puede ser más lento
      connectionTimeout: 30000,
      greetingTimeout: 30000,
      socketTimeout: 30000,
    }),
    // Tiempos por defecto para otros proveedores
    ...(!isAwsSes && {
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000,
    }),
  });
}

/**
 * Envía un correo usando nodemailer
 */
async function sendEmail(
  options: EmailOptions
): Promise<{ success: boolean; error?: string }> {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_FROM || "cloud@polpocr.com",
      to: options.to,
      bcc: options.bcc,
      subject: options.subject,
      text: options.text,
      html: options.html,
      attachments: options.attachments?.map((att) => ({
        filename: att.filename,
        content: att.content,
        contentType: att.contentType || "application/pdf",
      })),
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("Correo enviado exitosamente", {
      messageId: info.messageId,
      to: options.to,
      subject: options.subject,
    });

    return { success: true };
  } catch (error) {
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT || "587";

    console.error("Error enviando correo", error instanceof Error ? error : new Error("Error enviando correo"));
    console.error("Configuración SMTP", {
      host: smtpHost,
      port: smtpPort,
      user: process.env.SMTP_USERNAME ? "***" : "no definido",
    });

    let errorMessage = error instanceof Error ? error.message : "Error desconocido";

    // Mensajes de error más descriptivos
    if (errorMessage.includes("Greeting never received") || errorMessage.includes("ETIMEDOUT")) {
      errorMessage = `No se pudo conectar al servidor SMTP (${smtpHost}:${smtpPort}). Verifica que el servidor esté accesible y que el host/puerto sean correctos.`;
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
}

export const sendRegistrationEmail = internalAction({
  args: {
    email: v.string(),
    name: v.string(),
    groupName: v.string(),
  },
  handler: async (ctx, args) => {
    const { name, groupName, email } = args;
    const htmlCode = `
      <div style="font-family: sans-serif; padding: 20px;">
        <h1>Hola ${name}</h1>
        <p>Te has inscrito exitosamente al grupo: <strong>${groupName}</strong>.</p>
        <p>Esperamos verte pronto.</p>
      </div>
    `;
    const textCode = `Hola ${name},\n\nTe has inscrito exitosamente al grupo: ${groupName}.\n\nEsperamos verte pronto.`;

    const result = await sendEmail({
      to: email,
      subject: "Bienvenido a la comunidad de Orosi",
      html: htmlCode,
      text: textCode,
    });

    if (!result.success) {
      throw new Error(`Failed to send email: ${result.error}`);
    }
  },
});