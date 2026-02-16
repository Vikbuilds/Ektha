import { Metadata } from "next";
import RamayanaPage from "./RamayanaPage";

export const metadata: Metadata = {
  title: "रामायण (Ramayana)",
  description:
    "Read the Ramayana - the eternal story of Lord Rama composed by Maharshi Valmiki. Through 24,000 verses across 7 Kandas, discover love, duty, sacrifice, and the triumph of good over evil.",
  keywords: [
    "Ramayana",
    "रामायण",
    "Valmiki",
    "Lord Rama",
    "Sita",
    "Hanuman",
    "Epic",
    "Sanskrit",
    "Kanda",
    "Hindu Scriptures",
  ],
  openGraph: {
    title: "रामायण (Ramayana) | एकता (Ektha)",
    description:
      "Explore the Valmiki Ramayana - the ancient Indian epic depicting the life of Prince Rama.",
    url: "https://ektha.info/ramayana",
    images: ["/ramayana.png"],
  },
  alternates: {
    canonical: "https://ektha.info/ramayana",
  },
};

export default function Page() {
  return <RamayanaPage />;
}
