import { BraveWebSearchTool } from "./BraveWebSearch";
import { GetGithubUrlTool } from "./GetGithubUrlTool";
import { GetLinkedinUrlTool } from "./GetLinkedinUrlTool";
import { GetResumeUrlTool } from "./GetResumeUrlTool";
import { GetXUrlTool } from "./GetXUrlTool";
import { ShowContactFormTool } from "./ShowContactForm";

export const ChatTools = () => {
	return (
		<>
			<GetResumeUrlTool />
			<BraveWebSearchTool />
			<GetLinkedinUrlTool />
			<GetGithubUrlTool />
			<GetXUrlTool />
			<ShowContactFormTool />
		</>
	);
};
