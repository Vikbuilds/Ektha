import { Metadata } from "next";
import StructurePage from "./StructurePage";

export const metadata: Metadata = {
  title: "Structure & Organization",
  description:
    "Explore the hierarchical organization of Sanskrit literature - from Vedic texts to classical poetry, philosophy, and sciences. Understand how ancient Indian literature is categorized and organized.",
  keywords: [
    "Sanskrit Literature",
    "Vedic Literature",
    "Hindu Scriptures Structure",
    "Puranas",
    "Itihasa",
    "Darshana",
    "Indian Philosophy",
    "Ancient Texts Organization",
  ],
  openGraph: {
    title: "App Structure | एकता (Ektha)",
    description: "Explore the organizational structure of sacred ancient texts.",
    url: "https://ektha.info/structure",
  },
  alternates: {
    canonical: "https://ektha.info/structure",
  },
};

export default function Page() {
  return <StructurePage />;
}
