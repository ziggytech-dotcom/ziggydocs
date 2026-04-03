import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const RESEND_API_KEY = process.env.RESEND_API_KEY

  if (!RESEND_API_KEY) {
    return NextResponse.json(
      { error: "Contact form not configured. Please email hello@ziggybusiness.com" },
      { status: 503 }
    )
  }

  try {
    const body = await req.formData()
    const name = body.get("name") as string
    const email = body.get("email") as string
    const subject = body.get("subject") as string
    const message = body.get("message") as string

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "noreply@ziggybusiness.com",
        to: "hello@ziggybusiness.com",
        subject: `[ZiggyDocs Contact] [${subject}] from ${name}`,
        html: `<p><strong>From:</strong> ${name} (${email})</p><p><strong>Subject:</strong> ${subject}</p><p><strong>Message:</strong></p><p>${message}</p>`,
      }),
    })

    if (!res.ok) throw new Error("Resend error")

    return NextResponse.redirect(new URL("/contact?sent=1", req.url))
  } catch (err) {
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 })
  }
}
