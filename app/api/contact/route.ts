import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// Instantiate lazily so missing env vars don't break the build
function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error('RESEND_API_KEY environment variable is not set');
  return new Resend(key);
}

export async function POST(req: NextRequest) {
  const { name, email, subject, message } = await req.json();

  // Basic validation
  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return NextResponse.json({ error: 'Name, email, and message are required.' }, { status: 400 });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
  }

  const to = process.env.CONTACT_EMAIL;
  if (!to) {
    console.error('CONTACT_EMAIL environment variable is not set');
    return NextResponse.json({ error: 'Contact form is not configured.' }, { status: 500 });
  }

  try {
    const resend = getResend();
    await resend.emails.send({
      from: 'Puget Sound Salmon Health <onboarding@resend.dev>',
      to,
      replyTo: email,
      subject: `[Contact Form] ${subject?.trim() || 'Message from website'}`,
      text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject || '(none)'}\n\n${message}`,
      html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
        <p><strong>Subject:</strong> ${subject || '(none)'}</p>
        <hr />
        <p>${message.replace(/\n/g, '<br />')}</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Resend error:', err);
    return NextResponse.json({ error: 'Failed to send message. Please try again.' }, { status: 500 });
  }
}
