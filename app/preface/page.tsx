import { Metadata } from "next";
import PrefacePage from "./PrefacePage";

export const metadata: Metadata = {
  title: "Preface",
  description:
    "Learn about Project Ektha (एकता) - a modern digital museum of ancient Indian texts. Discover our mission to make timeless Sanskrit texts accessible and meaningful to contemporary readers.",
  openGraph: {
    title: "Preface | एकता (Ektha)",
    description: "The Genesis of Ektha - A digital archive bridging ancient vision with modern clarity.",
    url: "https://ektha.info/preface",
  },
  alternates: {
    canonical: "https://ektha.info/preface",
  },
};

export default function Page() {
  return <PrefacePage />;
}
