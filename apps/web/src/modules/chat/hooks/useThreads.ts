import { useQuery } from "@tanstack/react-query";
import { useChatContext } from "../ChatContext";

export const useThreads = () => {
  const { agentId, resourceId } = useChatContext();

  function fetchThreads() {
    return fetch("/api/thread", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ agentId, resourceId }),
    }).then((res) => res.json());
  }

  const { data: threads, isLoading, error, refetch } = useQuery({
    queryKey: ["threads", agentId, resourceId],
    queryFn: fetchThreads,
  });

  return { threads, isLoading, error, refetch };
};