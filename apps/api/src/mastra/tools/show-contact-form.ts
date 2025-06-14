import { createTool } from "@mastra/core/tools";
import { showContactForm } from "@repo/tools/show-contact-form";

export const showContactFormTool = createTool({
	id: showContactForm.id,
	description: showContactForm.description,
	inputSchema: showContactForm.inputSchema,
	outputSchema: showContactForm.outputSchema,
	execute: async ({ context }) => {
		return showContactForm.output;
	},
});
