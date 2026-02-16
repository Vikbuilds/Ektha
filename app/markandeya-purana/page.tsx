import { Metadata } from "next";
import MarkandeyaPuranaPage from "./MarkandeyaPuranaPage";

export const metadata: Metadata = {
  title: "मार्कण्डेय पुराण (Markandeya Purana)",
  description:
    "Read Markandeya Purana - one of the eighteen major Puranas containing stories of creation, mythology, and spiritual teachings including the Devi Mahatmyam.",
  keywords: [
    "Markandeya Purana",
    "मार्कण्डेय पुराण",
    "Puranas",
    "Devi Mahatmyam",
    "Hindu Mythology",
    "Sanskrit",
    "Creation Stories",
  ],
  openGraph: {
    title: "मार्कण्डेय पुराण (Markandeya Purana) | एकता (Ektha)",
    description:
      "Explore the Markandeya Purana - one of the major Puranas containing a dialogue between Sage Markandeya and Jaimini.",
    url: "https://ektha.info/markandeya-purana",
    images: ["/markandaye puran.png"],
  },
  alternates: {
    canonical: "https://ektha.info/markandeya-purana",
  },
};

export default function Page() {
  return <MarkandeyaPuranaPage />;
}
