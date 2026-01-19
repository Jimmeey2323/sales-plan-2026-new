import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { SmtpClient } from "https://deno.land/x/smtp@v0.8.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

async function sendViaSmtp(to: string, subject: string, html: string, from?: string) {
  const SMTP_HOST = Deno.env.get("MAILTRAP_SMTP_HOST") || "live.smtp.mailtrap.io";
  const SMTP_PORT = Number(Deno.env.get("MAILTRAP_SMTP_PORT") || "587");
  const SMTP_USER = Deno.env.get("MAILTRAP_SMTP_USER");
  const SMTP_PASS = Deno.env.get("MAILTRAP_SMTP_PASS");

  if (!SMTP_USER || !SMTP_PASS) {
    throw new Error("SMTP credentials not configured");
  }

  const client = new SmtpClient();

  // Connect and send. STARTTLS (port 587) should be negotiated by the client library.
  await client.connect({
    hostname: SMTP_HOST,
    port: SMTP_PORT,
    username: SMTP_USER,
    password: SMTP_PASS,
    // Use tls:true for implicit TLS (port 465), otherwise rely on STARTTLS where supported
    tls: SMTP_PORT === 465,
  });

  try {
    await client.send({
      from: from || "hello@physique57india.com",
      to,
      subject,
      content: "", // plain text left empty in favor of html
      html,
    });
  } finally {
    try { await client.close(); } catch (_) { /* ignore */ }
  }
}

async function sendViaApi(to: string, subject: string, html: string, from?: string) {
  const MAILTRAP_TOKEN = Deno.env.get("MAILTRAP_API_TOKEN");
  if (!MAILTRAP_TOKEN) throw new Error("Mailtrap API token not configured");

  const response = await fetch("https://send.api.mailtrap.io/api/send", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${MAILTRAP_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: {
        email: from || "hello@physique57india.com",
        name: "Physique 57 India",
      },
      to: [{ email: to }],
      subject,
      html,
    }),
  });

  const text = await response.text();
  if (!response.ok) throw new Error(text || `Mailtrap API error: ${response.status}`);

  try { return JSON.parse(text); } catch { return { message: text } }
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, subject, html, from }: EmailRequest = await req.json();

    console.log(`Sending email to: ${to}, subject: ${subject}`);

    // Prefer SMTP (if configured), otherwise fall back to Mailtrap HTTP API
    try {
      await sendViaSmtp(to, subject, html, from);
      console.log("Email sent via SMTP successfully");
      return new Response(JSON.stringify({ message: "Email sent via SMTP" }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    } catch (smtpErr) {
      console.warn("SMTP send failed, falling back to Mailtrap API:", smtpErr);
      const apiResult = await sendViaApi(to, subject, html, from);
      console.log("Email sent via Mailtrap API successfully");
      return new Response(JSON.stringify(apiResult), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }
  } catch (error: any) {
    console.error("Error in send-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
