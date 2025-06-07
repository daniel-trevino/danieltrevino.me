import { ChatPage } from "@/modules/chat/ChatPage";

export default async function ThreadPage({
	params,
}: {
	params: Promise<{ threadId: string }>;
}) {
	const { threadId } = await params;

	return <ChatPage threadId={threadId} />;
}
