import getSortedPosts from "@utils/getSortedPosts";
import { getCollection } from "astro:content";

export async function GET() {
  const posts = await getCollection("blog");
  const sortedPosts = await getSortedPosts(posts);
  const urlsXmlString = sortedPosts.map(post => {
    const lastMod = post.data.modDatetime ?? post.data.pubDatetime;
    const dateLastMod = new Date(lastMod).toISOString();
    return `
  <url>
    <loc>https://astro-paper.qisthi.dev/posts/${post.slug}</loc>
    <lastmod>${dateLastMod}</lastmod>
  </url>`;
  });
  const xmlString = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd http://www.google.com/schemas/sitemap-image/1.1 http://www.google.com/schemas/sitemap-image/1.1/sitemap-image.xsd" xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urlsXmlString.join(
    ""
  )}
</urlset>`;

  return new Response(xmlString);
}
