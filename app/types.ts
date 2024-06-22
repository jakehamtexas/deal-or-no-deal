export const BOT_USER_AGENT =
  "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)";

export const AMAZON_HOSTNAME = "https://www.amazon.com";

export type AmazonUrl = `${typeof AMAZON_HOSTNAME}${string}`;

export function isAmazonUrl(url: string): url is AmazonUrl {
  return url.startsWith(AMAZON_HOSTNAME);
}

export function assertIsAmazonUrl(url: string): asserts url is AmazonUrl {
  if (!isAmazonUrl(url)) {
    throw new Error("Not an Amazon URL");
  }
}

export const HTML_TTL = 1000 * 60 * 60 * 24; // 1 day
