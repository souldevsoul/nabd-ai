import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description: "Insights on authentic photography, AI detection, and the future of visual content from the Vertex team.",
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
