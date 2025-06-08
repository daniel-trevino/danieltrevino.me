import { BraveWebSearchTool } from "./BraveWebSearch";
import { KnowledgeSearchTool } from "./KnowledgeSearch";
import { ShareCVTool } from "./ShareCVTool";

export const ChatTools = () => {
	return (
		<>
			<ShareCVTool />
			<BraveWebSearchTool />
			<KnowledgeSearchTool />
		</>
	);
};
