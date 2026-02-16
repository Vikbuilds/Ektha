import { Metadata } from "next";
import YogaVasishthaPage from "./YogaVasishthaPage";

export const metadata: Metadata = {
  title: "योग वासिष्ठ (Yoga Vasishtha)",
  description:
    "Read Yoga Vasishtha - the philosophical dialogue between Prince Rama and Sage Vasishtha on Advaita Vedanta, consciousness, and the nature of reality.",
  keywords: [
    "Yoga Vasishtha",
    "योग वासिष्ठ",
    "Advaita Vedanta",
    "Vasishtha",
    "Rama",
    "Philosophy",
    "Sanskrit",
    "Consciousness",
    "Non-Dualism",
  ],
  openGraph: {
    title: "योगवासिष्ठ (Yoga Vasishtha) | एकता (Ektha)",
    description:
      "Dive into the philosophical teachings of the Yoga Vasishtha - a dialogue between Prince Rama and Sage Vasishtha.",
    url: "https://ektha.info/yoga-vasishtha",
    images: ["/yoga vasistha.png"],
  },
  alternates: {
    canonical: "https://ektha.info/yoga-vasishtha",
  },
};

export default function Page() {
  return <YogaVasishthaPage />;
}
