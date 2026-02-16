import { Metadata } from "next";
import RigvedaPage from "./RigvedaPage";

export const metadata: Metadata = {
  title: "ऋग्वेद (Rigveda)",
  description:
    "Read the Rigveda - the oldest of the four Vedas containing 1,028 hymns (sūktas) organized into 10 mandalas. Sacred hymns dedicated to various deities with profound philosophical insights.",
  keywords: [
    "Rigveda",
    "ऋग्वेद",
    "Vedas",
    "Mandala",
    "Sanskrit",
    "Ancient Indian Texts",
    "Hindu Scriptures",
    "Hymns",
    "Suktas",
  ],
  openGraph: {
    title: "ऋग्वेद (Rigveda) | एकता (Ektha)",
    description:
      "Explore the Rigveda - the oldest Vedic Sanskrit text containing hymns to the deities.",
    url: "https://ektha.info/rigveda",
    images: ["/rigveda.png"],
  },
  alternates: {
    canonical: "https://ektha.info/rigveda",
  },
};

export default function Page() {
  return <RigvedaPage />;
}
