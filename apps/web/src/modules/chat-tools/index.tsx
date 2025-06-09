import { BraveWebSearchTool } from "./BraveWebSearch";
import { GetGithubUrlTool } from "./GetGithubUrlTool";
import { GetLinkedinUrlTool } from "./GetLinkedinUrlTool";
import { GetXUrlTool } from "./GetXUrlTool";
import { KnowledgeSearchTool } from "./KnowledgeSearch";
import { ShareCVTool } from "./ShareCVTool";

export const ChatTools = () => {
	return (
		<>
			<ShareCVTool />
			<BraveWebSearchTool />
			<KnowledgeSearchTool />
			<GetLinkedinUrlTool />
			<GetGithubUrlTool />
			<GetXUrlTool />
		</>
	);
};
