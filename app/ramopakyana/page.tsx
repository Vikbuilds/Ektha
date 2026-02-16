import { Metadata } from "next";
import RamopakyanaPage from "./RamopakyanaPage";

export const metadata: Metadata = {
  title: "रामोपाख्यान (Ramopakyana)",
  description:
    "Read Ramopakyana - the story of Lord Rama as narrated in the Mahabharata. A condensed version of the Ramayana highlighting key events and teachings.",
  keywords: [
    "Ramopakyana",
    "रामोपाख्यान",
    "Mahabharata",
    "Rama",
    "Sanskrit",
    "Epic",
    "Hindu Scriptures",
  ],
  openGraph: {
    title: "रामोपाख्यान (Ramopakyana) | एकता (Ektha)",
    description:
      "Explore the Ramopakyana - the summary of Ramayana found within the Mahabharata.",
    url: "https://ektha.info/ramopakyana",
    images: ["/Rāmopākhyāna.png"],
  },
  alternates: {
    canonical: "https://ektha.info/ramopakyana",
  },
};

export default function Page() {
  return <RamopakyanaPage />;
}
