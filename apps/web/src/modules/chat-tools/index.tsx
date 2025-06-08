import { BraveWebSearchTool } from "./BraveWebSearch";
import { KnowledgeSearchTool } from "./KnowledgeSearch";
import { ShareCVTool } from "./ShareCVTool";
import { ShareGithubTool } from "./ShareGithubTool";
import { ShareLinkedinTool } from "./ShareLinkedinTool";
import { ShareXTool } from "./ShareXTool";

export const ChatTools = () => {
	return (
		<>
			<ShareCVTool />
			<BraveWebSearchTool />
			<KnowledgeSearchTool />
			<ShareLinkedinTool />
			<ShareGithubTool />
			<ShareXTool />
		</>
	);
};
