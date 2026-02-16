import AshtavakraGitaPage from "./AshtavakraGitaPage";

export const metadata = {
    openGraph: {
        title: "अष्टावक्र गीता (Ashtavakra Gita) | एकता (Ektha)",
        description:
            "Dive into the profound teachings of the Ashtavakra Gita - a classic Advaita Vedanta scripture.",
        url: "https://ektha.info/ashtavakra-gita",
        images: ["/bg.jpg"],
    },
    alternates: {
        canonical: "https://ektha.info/ashtavakra-gita",
    },
};

export default function Page() {
    return <AshtavakraGitaPage />;
}
