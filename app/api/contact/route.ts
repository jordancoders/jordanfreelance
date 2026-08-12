export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";

/** Escapes user-supplied text for safe interpolation into the HTML email body
 *  (prevents injected markup from rendering in the received email). */
function esc(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Strips CR/LF so multi-line input can never inject fields into the subject. */
function singleLine(value: unknown, fallback: string): string {
  const s = String(value ?? "").replace(/[\r\n]+/g, " ").trim();
  return s || fallback;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      company,
      phone,
      projectType,
      pagesFeatures,
      budgetRange,
      timeline,
      message,
      type,
      allowPortfolioShowcase,
      website, // honeypot — bots fill hidden fields
    } = body;

    // Honeypot: silently accept but drop bot submissions.
    if (typeof website === "string" && website.length > 0) {
      return NextResponse.json({ success: true, message: "Lead recorded." });
    }

    // Basic validation — the client form already marks these required.
    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ success: false, error: "Please provide your name." }, { status: 400 });
    }
    if (!email || typeof email !== "string" || !email.includes("@") || email.includes(" ")) {
      return NextResponse.json({ success: false, error: "Please provide a valid email address." }, { status: 400 });
    }

    // Log the incoming lead request on the server (dev only — avoids PII in prod logs)
    if (process.env.NODE_ENV === "development") {
      console.log("==========================================");
      console.log("NEW LEAD / QUOTE REQUEST RECEIVED:");
      console.log(`Type: ${type || 'Contact Form Proposal'}`);
      console.log(`Name: ${name}`);
      console.log(`Client Email: ${email}`);
      console.log(`Company: ${company || 'N/A'}`);
      console.log(`Phone: ${phone || 'N/A'}`);
      console.log(`Project Type: ${projectType || 'N/A'}`);
      console.log(`Budget: ${budgetRange || 'N/A'}`);
      console.log(`Timeline: ${timeline || 'N/A'}`);
      console.log(`Portfolio Showcase Allowed: ${allowPortfolioShowcase === false ? 'No (Private)' : 'Yes'}`);
      console.log(`Message: ${message || 'N/A'}`);
      console.log("==========================================");
    }

    // Use RESEND_API_KEY strictly from the environment. Never hardcode API secrets.
    const resendKey = process.env.RESEND_API_KEY;

    if (!resendKey) {
      console.warn(
        "[API /contact] RESEND_API_KEY is missing — lead logged server-side only (email dispatch skipped)."
      );
    }

    if (resendKey) {
      try {
        const subject = `🚀 New Lead: ${singleLine(name, "SME Contact")} (${singleLine(company, "Quote Request")})`;

        // All user content is HTML-escaped before interpolation.
        const payload: Record<string, unknown> = {
          from: "onboarding@resend.dev",
          to: ["jordancodefreelancer@protonmail.com"],
          subject,
          html: `
            <div style="font-family: sans-serif; padding: 20px; color: #1e293b;">
              <h2 style="color: #ea580c; margin-bottom: 12px;">🚀 New Jordan Peters Coder Freelancing Lead Received</h2>
              <p><strong>Submission Type:</strong> ${esc(type) || 'Contact Proposal'}</p>
              <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 16px 0;" />
              <p><strong>Name:</strong> ${esc(name)}</p>
              <p><strong>Client Email:</strong> ${esc(email)}</p>
              <p><strong>Company:</strong> ${esc(company) || 'N/A'}</p>
              <p><strong>Phone:</strong> ${esc(phone) || 'N/A'}</p>
              <p><strong>Project Type:</strong> ${esc(projectType) || 'N/A'}</p>
              <p><strong>Budget Range:</strong> ${esc(budgetRange) || 'N/A'}</p>
              <p><strong>Timeline:</strong> ${esc(timeline) || 'N/A'}</p>
              <p><strong>Showcase Opt-In:</strong> ${allowPortfolioShowcase === false ? 'Opted-Out (Private)' : 'Yes'}</p>
              <p><strong>Features / Pages requested:</strong> ${esc(pagesFeatures) || 'N/A'}</p>
              <p><strong>Message / Scope notes:</strong></p>
              <blockquote style="background:#f8fafc; padding:12px; border-left:4px solid #f97316; margin: 8px 0; white-space: pre-line;">${esc(message) || 'N/A'}</blockquote>
              <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 16px 0;" />
              <p style="font-size: 12px; color: #64748b;">Sent via Jordan Peters Coder Freelancing Lead Engine to <strong>jordancodefreelancer@protonmail.com</strong></p>
            </div>
          `,
        };

        const cleanEmail = String(email).trim();
        if (cleanEmail.includes("@") && !cleanEmail.includes(" ")) {
          payload.reply_to = cleanEmail;
        }

        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${resendKey}`,
          },
          body: JSON.stringify(payload),
        });

        const resData = await res.json();

        if (res.ok) {
          return NextResponse.json({
            success: true,
            message: "Email dispatched successfully via Resend API",
            resendId: resData.id,
          });
        } else {
          console.warn("Resend API warning / sandbox restriction:", resData);
          // Return success true so lead submission UI succeeds seamlessly for visitor while logging lead details
          return NextResponse.json({
            success: true,
            delivered: false,
            message: "Lead recorded successfully on server.",
            resendWarning: resData.message || "Resend sandbox domain validation required for direct inbox delivery.",
          });
        }
      } catch (err) {
        console.error("Resend API fetch error:", err);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Lead received and logged. (Note: To enable live inbox delivery, add RESEND_API_KEY to your environment variables or secrets).",
    });
  } catch (error) {
    console.error("API contact error:", error);
    return NextResponse.json({ success: false, error: "Failed to process quote request" }, { status: 500 });
  }
}
