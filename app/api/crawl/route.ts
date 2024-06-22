import { extractWishlistLinks, getOrUpdateHtml } from "@/app/lib/manager/html";
import { isAmazonUrl } from "@/app/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");

  if (!url) {
    return new NextResponse("No URL", { status: 400 });
  }

  if (!isAmazonUrl(url)) {
    return new NextResponse("Invalid URL", { status: 400 });
  }

  const html = await getOrUpdateHtml(url);
  if (!html) {
    return new NextResponse("Failed to get HTML", { status: 500 });
  }

  const res = extractWishlistLinks(html);

  return NextResponse.json(res);
}
