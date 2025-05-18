// src/lib/queryClient.ts
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient();

export async function apiRequest(method: string, url: string, body?: any) {
  console.log("Mock API request", method, url, body);

  await new Promise((res) => setTimeout(res, 500));
  return {
    id: Math.floor(Math.random() * 10000) + 1,
  };
}
