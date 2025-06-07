"use client";

import {
	type ReactNode,
	createContext,
	useContext,
	useEffect,
	useState,
} from "react";
import { v4 as uuidv4 } from "uuid";
import { useMessages } from "./hooks/useMessages";

const agentId = "assistantAgent";

interface ChatContextType {
	threadId: string;
	agentId: string;
	resourceId: string;
	generateThreadId: () => string;
	setThreadId: (threadId: string) => void;
	setAgentId: (agentId: string) => void;
	setResourceId: (resourceId: string) => void;
	reset: () => void;
}

const getInitialResourceId = () => {
	if (typeof window !== "undefined") {
		const stored = localStorage.getItem("resourceId");
		if (stored) return stored;
		const newId = uuidv4();
		localStorage.setItem("resourceId", newId);
		return newId;
	}
	return "";
};

const initialState = {
	threadId: "",
	agentId,
	resourceId: "",
};

export const ChatContext = createContext<ChatContextType>({
	...initialState,
	generateThreadId: () => uuidv4(),
	setThreadId: () => {},
	setAgentId: () => {},
	setResourceId: () => {},
	reset: () => {},
});

interface ChatContextProviderProps {
	children: ReactNode;
}

export const ChatContextProvider = ({ children }: ChatContextProviderProps) => {
	const [threadId, setThreadId] = useState(initialState.threadId);
	const [currentAgentId, setAgentId] = useState(initialState.agentId);
	const { refetch: refetchMessages } = useMessages();
	const [currentResourceId, setResourceId] = useState("");

	useEffect(() => {
		const id = getInitialResourceId();
		setResourceId(id);
	}, []);

	const generateThreadId = () => {
		const id = uuidv4();
		setThreadId(id);
		return id;
	};

	const reset = () => {
		setAgentId(initialState.agentId);
		generateThreadId();
		refetchMessages();
	};

	const value: ChatContextType = {
		threadId,
		agentId: currentAgentId,
		resourceId: currentResourceId,
		generateThreadId,
		setThreadId,
		setAgentId,
		setResourceId,
		reset,
	};

	return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChatContext = () => {
	const context = useContext(ChatContext);
	if (!context) {
		throw new Error("useChatContext must be used within a ChatContextProvider");
	}
	return context;
};
