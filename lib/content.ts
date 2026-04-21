import raw from "@/content/messages.json";

export type Content = typeof raw;
export const content = raw as Content;
