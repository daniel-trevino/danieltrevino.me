import { db } from "@/db/client";
import { contactFormSubmissions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";

/**
 * GET endpoint to retrieve form submission IDs for a given resource
 * This can track if a user has already submitted a form.
 * @param {NextRequest} request - The incoming HTTP request
 * @returns {Promise<NextResponse>} JSON response containing array of form IDs or error
 * @description Queries the database for all form submissions associated with the provided resourceId
 * and returns an array of their formIds. Returns 400 error if resourceId is not provided.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const resourceId = searchParams.get("resourceId");
  if (!resourceId) {
    return NextResponse.json({ error: "Missing resourceId" }, { status: 400 });
  }
  const submissions = await db
    .select({ formId: contactFormSubmissions.formId })
    .from(contactFormSubmissions)
    .where(eq(contactFormSubmissions.userId, resourceId));
  // Return an array of formIds
  return NextResponse.json({ formIds: submissions.map((s) => s.formId) });
}
