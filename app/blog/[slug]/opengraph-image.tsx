import { ImageResponse } from "next/og";
import { BlogService } from "@/src/services/blog.service";

export const alt = "Blog Post";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function BlogOGImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const blog = await BlogService.getBlogBySlug(slug);
  const title = blog?.title ?? "Blog Post";
  const excerpt = blog?.excerpt ?? "Dimas Febriyanto — Software Engineer";

  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
        }}
      >
        <div style={{ fontSize: 18, color: "#60a5fa", marginBottom: 24 }}>
          dimassfeb.com/blog
        </div>
        <div
          style={{
            fontSize: 56,
            fontWeight: "bold",
            color: "white",
            lineHeight: 1.2,
            marginBottom: 24,
          }}
        >
          {title}
        </div>
        <div style={{ fontSize: 24, color: "#94a3b8" }}>{excerpt}</div>
        <div
          style={{
            position: "absolute",
            bottom: 60,
            right: 80,
            fontSize: 18,
            color: "#475569",
          }}
        >
          Dimas Febriyanto
        </div>
      </div>
    ),
    { ...size }
  );
}
