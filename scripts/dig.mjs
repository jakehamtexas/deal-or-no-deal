import { extractFromUrl, extractFromHTML } from "@jcottam/html-metadata";
import { parse } from "node-html-parser";
import { readFileSync } from "fs";

const USER_AGENT =
  "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)";
const URL = "https://www.amazon.com/hz/wishlist/ls/3SA48CTH2LL4R?ref_=wl_share";
const AMAZON_HOSTNAME = "https://www.amazon.com";

async function fromUrl(href) {
  const extracted = await extractFromUrl(href);

  return extracted?.["og:image"];
}

async function getHtml(href) {
  const response = await fetch(href, {
    headers: {
      "User-Agent": USER_AGENT,
    },
  });
  const text = await response.text();

  return text;
}

async function fromHtml(text) {
  const extracted = extractFromHTML(text);

  return extracted?.["og:image"];
}

async function getWishlistLinks(html) {
  const parsed = parse(html);
  const aTags = parsed.querySelectorAll("a");

  const itemHrefs = [
    ...new Set(
      aTags
        .filter((a) => a.hasAttribute("title"))
        .map(
          (a) => `${AMAZON_HOSTNAME}${a.getAttribute("href").split("?")[0]}`,
        ),
    ),
  ];

  let showMoreHref = parsed
    .querySelector('[aria-labelledby="showMoreUrlId"]')
    ?.getAttribute("href");

  if (showMoreHref) {
    showMoreHref = `${AMAZON_HOSTNAME}${showMoreHref}`;
  }

  return { itemHrefs, showMoreHref };
}

function getHtmlFromFile(file = "./scripts/wishlist-example.html") {
  const buf = readFileSync(file);
  return buf.toString();
}

export async function main() {
  // await withHtml();
  // getHtmlFromFile();

  const html = await getHtml(URL);
  let res = await getWishlistLinks(html);

  const max = 5;
  let current = 0;

  const allHrefs = [...res.itemHrefs];
  let canLoadMore = !!res.showMoreHref;
  while (canLoadMore && current < max) {
    current++;
    const response = await fetch(res.showMoreHref, {
      headers: {
        "User-Agent": USER_AGENT,
      },
    });
    const text = await response.text();
    res = await getWishlistLinks(text);

    allHrefs.push(...res.itemHrefs);

    canLoadMore = !!res.showMoreHref;
  }

  console.log(...allHrefs);

  for (const href of allHrefs) {
    const html = await getHtml(href);
    const landingImage = parse(html).getElementById("landingImage");
    const ogImage = landingImage.getAttribute("src");
    console.log(ogImage);
  }
}

main();
