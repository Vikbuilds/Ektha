import { Metadata } from "next";
import ParasharaPage from "./ParasharaPage";

export const metadata: Metadata = {
  title: "पराशर होरा शास्त्र (Parashara Hora Shastra)",
  description:
    "Read Parashara Hora Shastra - the foundational text of Vedic astrology by Sage Parashara. Comprehensive teachings on horoscopy, planetary influences, and predictive astrology.",
  keywords: [
    "Parashara Hora Shastra",
    "पराशर होरा शास्त्र",
    "Vedic Astrology",
    "Jyotish",
    "Horoscopy",
    "Sanskrit",
    "Sage Parashara",
    "Planets",
  ],
  openGraph: {
    title: "पराशर स्मृति (Parashara Smriti) | एकता (Ektha)",
    description:
      "Read the Parashara Smriti - a code of laws for the Kali Yuga attributed to the sage Parashara.",
    url: "https://ektha.info/parashara",
    images: ["/parahar sastra.png"],
  },
  alternates: {
    canonical: "https://ektha.info/parashara",
  },
};

export default function Page() {
  return <ParasharaPage />;
}
