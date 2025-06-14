import { z } from "zod";
import type { Tool } from "./types";

export const showContactForm: Tool = {
  id: "show_contact_form",
  description: "Renders a contact form to be able to contact Daniel Treviño Bergman",
  inputSchema: z.object({
    email: z.string().email().optional(),
    name: z.string().optional(),
    phone: z.string().optional(),
    message: z.string().optional(),
  }),
  outputSchema: z.object({
    uniqueId: z.string().describe("A unique ID for the contact form"),
    success: z.boolean(),
  }),
  output: {
    uniqueId: crypto.randomUUID(),
    success: true,
  },
};
