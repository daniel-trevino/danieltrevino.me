"use client";

import { v4 as uuidv4 } from "uuid";
import { useLocalStorage } from "./use-local-storage";

/**
 * A specialized hook for managing the resource ID with automatic UUID generation
 * @returns A tuple containing the current resource ID and a setter function
 */
export function useResourceId(): [string, (value: string) => void] {
  const [resourceId, setResourceId] = useLocalStorage("resourceId", "");

  // If no resource ID exists, generate one
  if (!resourceId && typeof window !== "undefined") {
    const newId = uuidv4();
    setResourceId(newId);
    return [newId, setResourceId];
  }

  return [resourceId, setResourceId];
} 