"use client";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { makeAssistantToolUI } from "@assistant-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { showContactForm } from "@repo/tools/show-contact-form";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const contactFormSchema = z.object({
	email: z
		.string()
		.email("Please enter a valid email address")
		.optional()
		.or(z.literal("")),
	name: z.string().optional(),
	phone: z.string().optional(),
	message: z.string().optional(),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

export const ShowContactFormTool = makeAssistantToolUI<
	z.infer<typeof showContactForm.inputSchema>,
	z.infer<typeof showContactForm.outputSchema>
>({
	toolName: showContactForm.id,
	render: ({ args, status, result }) => {
		const formId = result?.uniqueId || "contact-form";
		const [submittedFormIds, setSubmittedFormIds] = useLocalStorage<string[]>(
			"submitted-contact-forms",
			[],
		);
		const [isSubmitting, setIsSubmitting] = useState(false);

		// Check if this form was already submitted
		const isSubmitted = submittedFormIds.includes(formId);

		const form = useForm<ContactFormData>({
			resolver: zodResolver(contactFormSchema),
			defaultValues: {
				email: "",
				name: "",
				phone: "",
				message: "",
			},
		});

		// Update form values when args change (only if not already submitted)
		useEffect(() => {
			if (args && !isSubmitted) {
				form.reset({
					email: args.email || "",
					name: args.name || "",
					phone: args.phone || "",
					message: args.message || "",
				});
			}
		}, [args, form, isSubmitted]);

		const onSubmit = async (data: ContactFormData) => {
			// Prevent duplicate submissions
			if (submittedFormIds.includes(formId)) {
				console.log(
					`Form [${formId}] already submitted, ignoring duplicate submission`,
				);
				return;
			}

			setIsSubmitting(true);
			console.log(
				`TODO: Make API request to submit contact form [${formId}]`,
				data,
			);
			// TODO: Make API request to submit contact form

			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1000));

			// Mark form as submitted in localStorage
			setSubmittedFormIds((prev) => [...prev, formId]);
			setIsSubmitting(false);
		};

		if (status.type === "running") {
			return (
				<div className="flex items-center gap-2">
					<Loader2 className="h-4 w-4 animate-spin" />
					<span>Preparing contact form...</span>
				</div>
			);
		}

		if (status.type === "incomplete" && status.reason === "error") {
			return <div className="text-red-500">Failed to load contact form</div>;
		}

		return (
			<div className="max-w-md mb-4">
				<AnimatePresence mode="wait">
					{isSubmitted ? (
						<motion.div
							key="success"
							initial={{ opacity: 0, scale: 0.8, y: 20 }}
							animate={{ opacity: 1, scale: 1, y: 0 }}
							exit={{ opacity: 0, scale: 0.8, y: -20 }}
							transition={{
								duration: 0.5,
								ease: [0.4, 0, 0.2, 1],
								layout: { duration: 0.3 },
							}}
							className="rounded-lg border bg-green-50 border-green-200 p-6 shadow-sm"
						>
							<motion.div
								className="flex items-center gap-3 mb-2"
								initial={{ x: -20, opacity: 0 }}
								animate={{ x: 0, opacity: 1 }}
								transition={{ delay: 0.2, duration: 0.3 }}
							>
								<motion.div
									className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full"
									initial={{ scale: 0 }}
									animate={{ scale: 1 }}
									transition={{ delay: 0.3, duration: 0.3, type: "spring" }}
								>
									<Check className="h-5 w-5 text-green-600" />
								</motion.div>
								<h3 className="text-lg font-semibold text-green-800">
									Message Sent Successfully!
								</h3>
							</motion.div>
							<motion.p
								className="text-green-700 text-sm"
								initial={{ y: 10, opacity: 0 }}
								animate={{ y: 0, opacity: 1 }}
								transition={{ delay: 0.4, duration: 0.3 }}
							>
								I have forwarded your message to Daniel Treviño Bergman. He will
								reach out to you soon.
							</motion.p>
						</motion.div>
					) : (
						<motion.div
							key="form"
							initial={{ opacity: 0, scale: 0.95, y: 20 }}
							animate={{ opacity: 1, scale: 1, y: 0 }}
							exit={{ opacity: 0, scale: 0.95, y: -20 }}
							transition={{
								duration: 0.4,
								ease: [0.4, 0, 0.2, 1],
								layout: { duration: 0.3 },
							}}
							className="rounded-lg border bg-white p-6 shadow-sm"
						>
							<motion.h3
								className="text-lg font-semibold text-gray-900 mb-4"
								initial={{ y: -10, opacity: 0 }}
								animate={{ y: 0, opacity: 1 }}
								transition={{ delay: 0.1, duration: 0.3 }}
							>
								Contact Daniel Treviño Bergman
							</motion.h3>

							<Form {...form}>
								<motion.form
									id={formId}
									onSubmit={form.handleSubmit(onSubmit)}
									className="space-y-4"
									initial={{ y: 10, opacity: 0 }}
									animate={{ y: 0, opacity: 1 }}
									transition={{ delay: 0.2, duration: 0.3 }}
								>
									<FormField
										control={form.control}
										name="name"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Name</FormLabel>
												<FormControl>
													<Input placeholder="Your name" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="email"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Email</FormLabel>
												<FormControl>
													<Input
														type="email"
														placeholder="your.email@example.com"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="phone"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Phone (Optional)</FormLabel>
												<FormControl>
													<Input
														type="tel"
														placeholder="Your phone number"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="message"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Message</FormLabel>
												<FormControl>
													<Textarea
														placeholder="Your message..."
														className="min-h-[100px]"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<Button
										type="submit"
										className="w-full"
										disabled={isSubmitting}
									>
										{isSubmitting ? (
											<>
												<Loader2 className="h-4 w-4 animate-spin mr-2" />
												Sending...
											</>
										) : (
											"Send Message"
										)}
									</Button>
								</motion.form>
							</Form>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		);
	},
});
