import { AmazonUrl, BOT_USER_AGENT } from "@/app/types";
import axios from "axios";

export async function getRequest<T>(
  url: string,
  options: {
    headers?: Record<string, string>;
    params?: Record<string, string>;
  } = {},
): Promise<T | undefined> {
  const retryWithBackoff = [0, 1_000, 3_000, 10_000];

  for (const delay of retryWithBackoff) {
    await new Promise((resolve) => setTimeout(resolve, delay));
    try {
      const response = await axios.get(url, options);
      return response.data;
    } catch (e) {
      console.error({ delay, retryWithBackoff, e });
    }
  }
}

export async function getHtml(href: AmazonUrl) {
  return getRequest<string>(href, {
    headers: {
      "User-Agent": BOT_USER_AGENT,
    },
  });
}
