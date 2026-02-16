import { Metadata } from "next";
import ContentsPage from "./ContentsPage";

export const metadata: Metadata = {
  title: "Sacred Texts Collection",
  description:
    "Browse our complete collection of ancient Indian scriptures including Rigveda, Ramayana, Mahabharata, Bhagavad Gita, Srimad Bhagavatam, and more.",
  openGraph: {
    title: "Sacred Texts Collection | एकता (Ektha)",
    description:
      "Browse our complete collection of ancient Indian scriptures including Rigveda, Ramayana, Mahabharata, and more.",
    url: "https://ektha.info/contents",
  },
  alternates: {
    canonical: "https://ektha.info/contents",
  },
};

export default function Page() {
  return <ContentsPage />;
}
