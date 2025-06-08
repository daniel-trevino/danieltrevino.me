import { useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { useChatContext } from "../ChatContext";

export const useMessages = (threadIdProp?: string) => {
  const { agentId, resourceId, threadId: contextThreadId } = useChatContext();
  const pathname = usePathname();

  // Use the passed threadId if provided, otherwise fall back to context
  const threadId = threadIdProp || contextThreadId;

  const { data: messages, isLoading, refetch } = useQuery({
    queryKey: ["messages", threadId],
    queryFn: () =>
      fetch("/api/message", {
        method: "POST",
        body: JSON.stringify({ agentId, threadId, resourceId }),
      }).then((res) => res.json()),
    enabled: !!threadId && pathname !== "/", // Only run query if we have a threadId and not on root page
  });

  return { messages, isLoading, refetch };
};