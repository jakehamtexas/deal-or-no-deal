import { AmazonUrl, HTML_TTL } from "@/app/types";
import { db, page, eq } from "@/db";

export async function findFreshHtml(url: AmazonUrl) {
  const [record] = await db
    .select({ content: page.content, updatedAt: page.updatedAt })
    .from(page)
    .where(eq(page.url, url));

  const oneDayAgo = new Date(Date.now() - HTML_TTL);

  if (!record || record.updatedAt < oneDayAgo) {
    return;
  }

  return record.content;
}

export async function saveHtml(url: AmazonUrl, html: string) {
  const now = new Date();
  return await db
    .insert(page)
    .values([
      {
        url,
        content: html,
        createdAt: now,
        updatedAt: now,
      },
    ])
    .returning();
}
