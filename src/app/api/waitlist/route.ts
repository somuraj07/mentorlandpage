import { NextResponse } from "next/server";

/**
 * Waitlist endpoint.
 * TODO: connect a real store (database, Google Sheet, Resend audience, etc.).
 * Right now it only validates the request and logs it on the server.
 */
export async function POST(request: Request) {
  let body: { email?: unknown; role?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const role = body.role === "mentor" ? "mentor" : "learner";

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  console.log(`[waitlist] ${role}: ${email}`);
  return NextResponse.json({ ok: true });
}
