import { Metadata } from "next";
import ManuSmritiPage from "./ManuSmritiPage";

export const metadata: Metadata = {
  title: "मनु स्मृति (Manu Smriti)",
  description:
    "Read Manu Smriti - the ancient text of Hindu law and social order. Contains guidelines for righteous living, social conduct, and dharma.",
  keywords: [
    "Manu Smriti",
    "मनु स्मृति",
    "Laws of Manu",
    "Dharma Shastra",
    "Hindu Law",
    "Sanskrit",
    "Social Order",
  ],
  openGraph: {
    title: "मनुस्मृति (Manu Smriti) | एकता (Ektha)",
    description:
      "Read the Manu Smriti - the authoritative ancient Indian legal text providing a guide to dharma.",
    url: "https://ektha.info/manu-smriti",
    images: ["/manu smriti.png"],
  },
  alternates: {
    canonical: "https://ektha.info/manu-smriti",
  },
};

export default function Page() {
  return <ManuSmritiPage />;
}
