import { Metadata } from "next";
import MahabharataPage from "./MahabharataPage";

export const metadata: Metadata = {
  title: "महाभारत (Mahabharata)",
  description:
    "Read the Mahabharata - the longest epic poem ever written with over 100,000 verses by Maharshi Vyasa. Explore the great war between Pandavas and Kauravas, including the Bhagavad Gita.",
  keywords: [
    "Mahabharata",
    "महाभारत",
    "Vyasa",
    "Pandavas",
    "Kauravas",
    "Bhagavad Gita",
    "Kurukshetra",
    "Epic",
    "Sanskrit",
    "Parva",
    "Hindu Scriptures",
  ],
  openGraph: {
    title: "महाभारत (Mahabharata) | एकता (Ektha)",
    description:
      "Explore the Mahabharata - one of the two major Sanskrit epics of ancient India.",
    url: "https://ektha.info/mahabharata",
    images: ["/mahabharata.png"],
  },
  alternates: {
    canonical: "https://ektha.info/mahabharata",
  },
};

export default function Page() {
  return <MahabharataPage />;
}
