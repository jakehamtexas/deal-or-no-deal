import { AMAZON_HOSTNAME, AmazonUrl, assertIsAmazonUrl } from "@/app/types";
import { findFreshHtml, saveHtml } from "../resource/db";
import { getHtml } from "../resource/amazon";
import { parse } from "node-html-parser";

export async function getOrUpdateHtml(url: AmazonUrl) {
  let html = await findFreshHtml(url);
  if (!html) {
    html = await getHtml(url);
    if (!html) {
      return;
    }
    // Cache it for next time
    await saveHtml(url, html);
  }

  return html;
}

export type WishlistJson = {
  itemHrefs: AmazonUrl[];
  showMoreHref: AmazonUrl | undefined;
};

export function extractWishlistLinks(raw: string): WishlistJson {
  const parsed = parse(raw);
  const aTags = parsed.querySelectorAll("a");

  const itemHrefs = Array.from(
    new Set(
      aTags
        .filter((a) => a.hasAttribute("title") && a.hasAttribute("href"))
        .map(
          (a) => `${AMAZON_HOSTNAME}${a.getAttribute("href")!.split("?")[0]}`,
        )
        .map((href) => {
          assertIsAmazonUrl(href);

          return href;
        }),
    ),
  );

  let showMoreHref = parsed
    .querySelector('[aria-labelledby="showMoreUrlId"]')
    ?.getAttribute("href");

  if (!showMoreHref) {
    return { itemHrefs, showMoreHref: undefined };
  }

  showMoreHref = `${AMAZON_HOSTNAME}${showMoreHref}`;
  assertIsAmazonUrl(showMoreHref);

  return { itemHrefs, showMoreHref };
}
