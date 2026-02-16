import { Metadata } from "next";
import SrimadBhagavatamPage from "./SrimadBhagavatamPage";

export const metadata: Metadata = {
  title: "श्रीमद् भागवतम् (Srimad Bhagavatam)",
  description:
    "Read Srimad Bhagavatam (Bhagavata Purana) - the story of Lord Krishna and his divine pastimes across 12 Skandas. One of the eighteen major Puranas with profound philosophical teachings.",
  keywords: [
    "Srimad Bhagavatam",
    "Bhagavata Purana",
    "श्रीमद् भागवतम्",
    "Krishna",
    "Puranas",
    "Sanskrit",
    "Skandas",
    "Hindu Scriptures",
  ],
  openGraph: {
    title: "श्रीमद्भागवतम् (Srimad Bhagavatam) | एकता (Ektha)",
    description:
      "Explore the Srimad Bhagavatam - one of the 18 major Puranas that focuses on bhakti to Krishna.",
    url: "https://ektha.info/srimad-bhagavatam",
    images: ["/srimad bhagvatam.png"],
  },
  alternates: {
    canonical: "https://ektha.info/srimad-bhagavatam",
  },
};

export default function Page() {
  return <SrimadBhagavatamPage />;
}
