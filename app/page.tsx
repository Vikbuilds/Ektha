import { Metadata } from "next";
import HomePage from "./HomePage";

export const metadata: Metadata = {
  title: "एकता (Ektha) - Digital Museum of Ancient Indian Scriptures",
  description:
    "Discover ancient Indian texts through a modern digital library designed to make reading, exploration, and understanding more approachable and interconnected.",
  openGraph: {
    title: "एकता (Ektha) - Digital Museum of Ancient Indian Scriptures",
    description:
      "Discover ancient Indian texts through a modern digital library designed to make reading, exploration, and understanding more approachable and interconnected",
    url: "https://ektha.info",
  },
};

export default function Page() {
  return <HomePage />;
}

