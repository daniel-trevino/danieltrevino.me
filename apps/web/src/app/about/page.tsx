import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
	return (
		<div className="max-w-4xl mx-auto px-2 py-8 space-y-8">
			<div className="mb-4">
				<Link
					href="/"
					className="inline-flex items-center text-primary font-semibold hover:underline"
				>
					<ArrowLeft className="mr-2 h-5 w-5" /> Back
				</Link>
			</div>
			<section className="space-y-6">
				<h2 className="text-3xl font-bold text-foreground mb-4">How to use</h2>
				<ul className="space-y-3 text-muted-foreground">
					<li className="flex items-start">
						<span className="inline-block w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
						<span className="text-base leading-relaxed">
							You can{" "}
							<Link href="/" className="text-primary font-bold hover:underline">
								chat directly
							</Link>{" "}
							with an AI Agent that has full knowledge of me and my work in this
							website.
						</span>
					</li>
					<li className="flex items-start">
						<span className="inline-block w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
						<span className="text-base leading-relaxed">
							You can also connect to the MCP Server to use the available tools
							in your own assistant/LLM.
						</span>
					</li>
				</ul>
			</section>

			<section className="space-y-6">
				<h2 className="text-3xl font-bold text-foreground mb-4">
					How to connect to the MCP Server
				</h2>
				<div className="bg-primary/10 border border-primary/10 p-6 rounded-lg space-y-4">
					<p className="font-semibold text-lg text-foreground">
						For clients that support direct HTTP connections:
					</p>
					<ul className="space-y-3 text-muted-foreground">
						<li className="flex items-start">
							<span className="inline-block w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
							<span className="text-base leading-relaxed">
								Connect to:{" "}
								<code className="bg-background/80 border border-border px-2 py-1 rounded font-mono text-xs md:text-sm text-foreground">
									https://danieltrevino.me/api/mcp
								</code>
							</span>
						</li>
						<li className="flex items-start">
							<span className="inline-block w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
							<span className="text-base leading-relaxed">
								Use standard MCP protocol methods to interact with the server
							</span>
						</li>
						<li className="flex items-start">
							<span className="inline-block w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
							<span className="text-base leading-relaxed">
								No local installation required - the server is already hosted
								and ready to use
							</span>
						</li>
					</ul>
				</div>
			</section>

			<section className="space-y-6">
				<h2 className="text-3xl font-bold text-foreground mb-4">
					For talent evaluators
				</h2>
				<div className="bg-primary/10 border border-primary/10 p-6 rounded-lg space-y-4">
					<p className="font-semibold text-lg text-foreground">
						These are examples of how to prompt based on the different roles
					</p>
					<ul className="space-y-3 text-muted-foreground">
						<li className="flex items-start">
							<span className="inline-block w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
							<p className="text-base leading-relaxed">
								<span className="font-bold">Recruiters:</span> Ask about my
								experience, skills, and background directly.
							</p>
						</li>
						<li className="flex items-start">
							<span className="inline-block w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
							<p className="text-base leading-relaxed">
								<span className="font-bold">
									Startup Founders & Small Teams:
								</span>
								Assess my fit as a generalist in lean environments. Example:
								"Would Daniel be a good fit for a full-stack role at an
								early-stage startup?"
							</p>
						</li>
						<li className="flex items-start">
							<span className="inline-block w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
							<p className="text-base leading-relaxed">
								<span className="font-bold">Hiring Managers:</span> Drill into
								my proficiency with specific technologies. Example: "What's
								Daniel's proficiency level with React, TypeScript, and DevOps?"
							</p>
						</li>
						<li className="flex items-start">
							<span className="inline-block w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
							<p className="text-base leading-relaxed">
								<span className="font-bold">Interview Coordinators:</span>{" "}
								Generate tailored phone screens or take-home assignments.
								Example: "Create a phone screen for Daniel focused on React
								performance optimization and state management."
							</p>
						</li>
						<li className="flex items-start">
							<span className="inline-block w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
							<p className="text-base leading-relaxed">
								<span className="font-bold">Career Coaches:</span> Use my
								resume, GitHub activity, and website content for assessments.
								Example: "Summarize Daniel's career highlights."
							</p>
						</li>
						<li className="flex items-start">
							<span className="inline-block w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
							<p className="text-base leading-relaxed">
								<span className="font-bold">Product Managers & Designers:</span>{" "}
								Learn how I collaborate on product vision and feature
								prioritization. Example: "How would Daniel contribute to our
								feature roadmap?"
							</p>
						</li>
						<li className="flex items-start">
							<span className="inline-block w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
							<p className="text-base leading-relaxed">
								<span className="font-bold">Anyone Evaluating Fit:</span> Use
								the prompt: "Is Daniel a good fit for this role? [paste job
								description or URL]"
							</p>
						</li>
					</ul>
				</div>
			</section>
		</div>
	);
}
