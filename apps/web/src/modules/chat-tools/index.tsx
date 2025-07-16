import { FetchWebpageTool } from "./FetchWebpageTool";
import { GetDateTool } from "./GetDate";
import { GetGithubUrlTool } from "./GetGithubUrlTool";
import { GetLinkedinUrlTool } from "./GetLinkedinUrlTool";
import { GetResumeUrlTool } from "./GetResumeUrlTool";
import { GetXUrlTool } from "./GetXUrlTool";
import { ShowContactFormTool } from "./ShowContactForm";

export const ChatTools = () => {
	return (
		<>
			<GetResumeUrlTool />
			<FetchWebpageTool />
			<GetLinkedinUrlTool />
			<GetGithubUrlTool />
			<GetXUrlTool />
			<ShowContactFormTool />
			<GetDateTool />
		</>
	);
};
