import { type NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { z } from "zod";

// Validation schema for contact form data
const contactFormSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address")
    .optional()
    .or(z.literal("")),
  name: z.string().optional(),
  phone: z.string().optional(),
  message: z.string().optional(),
  formId: z.string().optional(),
});

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number.parseInt(process.env.SMTP_PORT || "587"),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validatedData = contactFormSchema.parse(body);

    // Check if required environment variables are set
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.error("SMTP credentials not configured");
      return NextResponse.json(
        { error: "Email service not configured" },
        { status: 500 },
      );
    }

    if (!process.env.CONTACT_EMAIL_TO) {
      console.error("CONTACT_EMAIL_TO not configured");
      return NextResponse.json(
        { error: "Contact email not configured" },
        { status: 500 },
      );
    }

    // Prepare email content
    const emailContent = `
New contact form submission:

Name: ${validatedData.name || "Not provided"}
Email: ${validatedData.email || "Not provided"}
Phone: ${validatedData.phone || "Not provided"}

Message:
${validatedData.message || "No message provided"}

Form ID: ${validatedData.formId || "Unknown"}
Submitted at: ${new Date().toISOString()}
`;

    // Email options
    const mailOptions = {
      from: `"Contact Form" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_EMAIL_TO,
      subject: `New Contact Form Submission from ${validatedData.name || validatedData.email || "Website"}`,
      text: emailContent,
      html: `
				<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
					<h2 style="color: #333; border-bottom: 2px solid #eee; padding-bottom: 10px;">
						New Contact Form Submission
					</h2>
					
					<div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
						<p><strong>Name:</strong> ${validatedData.name || "Not provided"}</p>
						<p><strong>Email:</strong> ${validatedData.email || "Not provided"}</p>
						<p><strong>Phone:</strong> ${validatedData.phone || "Not provided"}</p>
					</div>
					
					<div style="margin: 20px 0;">
						<h3 style="color: #333; margin-bottom: 10px;">Message:</h3>
						<div style="background-color: #fff; padding: 15px; border-left: 4px solid #007bff; white-space: pre-wrap;">
							${validatedData.message || "No message provided"}
						</div>
					</div>
					
					<div style="font-size: 12px; color: #666; border-top: 1px solid #eee; padding-top: 10px; margin-top: 20px;">
						<p>Form ID: ${validatedData.formId || "Unknown"}</p>
						<p>Submitted at: ${new Date().toLocaleString()}</p>
					</div>
				</div>
			`,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);

    console.log("Contact form email sent:", info.messageId);

    return NextResponse.json(
      {
        success: true,
        message: "Email sent successfully",
        messageId: info.messageId,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error sending contact form email:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid form data", details: error.errors },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 },
    );
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
