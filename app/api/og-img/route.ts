import { getOrUpdateHtml } from "@/app/lib/manager/html";
import { isAmazonUrl } from "@/app/types";
import { NextRequest, NextResponse } from "next/server";

import { parse } from "node-html-parser";

export type OgImageJson = { ogImage: string };

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
    return new NextResponse("Failed to fetch HTML", { status: 500 });
  }

  const landingImage = parse(html).getElementById("landingImage");

  const ogImage = landingImage?.getAttribute("src");

  if (!ogImage) {
    return new NextResponse("No image found", { status: 404 });
  }

  return NextResponse.json({ ogImage });
}
