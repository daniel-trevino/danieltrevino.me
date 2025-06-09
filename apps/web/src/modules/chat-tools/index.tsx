import { BraveWebSearchTool } from "./BraveWebSearch";
import { GetGithubUrlTool } from "./GetGithubUrlTool";
import { KnowledgeSearchTool } from "./KnowledgeSearch";
import { ShareCVTool } from "./ShareCVTool";
import { ShareLinkedinTool } from "./ShareLinkedinTool";
import { ShareXTool } from "./ShareXTool";

export const ChatTools = () => {
	return (
		<>
			<ShareCVTool />
			<BraveWebSearchTool />
			<KnowledgeSearchTool />
			<ShareLinkedinTool />
			<GetGithubUrlTool />
			<ShareXTool />
		</>
	);
};
