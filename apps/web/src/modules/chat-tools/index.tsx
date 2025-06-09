import { BraveWebSearchTool } from "./BraveWebSearch";
import { GetGithubUrlTool } from "./GetGithubUrlTool";
import { GetLinkedinUrlTool } from "./GetLinkedinUrlTool";
import { GetResumeUrlTool } from "./GetResumeUrlTool";
import { GetXUrlTool } from "./GetXUrlTool";
import { KnowledgeSearchTool } from "./KnowledgeSearch";

export const ChatTools = () => {
	return (
		<>
			<GetResumeUrlTool />
			<BraveWebSearchTool />
			<KnowledgeSearchTool />
			<GetLinkedinUrlTool />
			<GetGithubUrlTool />
			<GetXUrlTool />
		</>
	);
};
