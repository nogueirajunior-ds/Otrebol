import dynamic from "next/dynamic";
import { Advantages } from "@/components/Advantages";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { SkipLink } from "@/components/SkipLink";

/**
 * Below-the-fold sections are code-split, so the initial bundle only carries the header, hero
 * and first content section. They are still server-rendered for SEO.
 */
const CityTabs = dynamic(() => import("@/components/CityTabs").then((m) => m.CityTabs));
const ExpansionBanner = dynamic(() => import("@/components/ExpansionBanner").then((m) => m.ExpansionBanner));
const Quality = dynamic(() => import("@/components/Quality").then((m) => m.Quality));
const ContactForm = dynamic(() => import("@/components/ContactForm").then((m) => m.ContactForm));
const Footer = dynamic(() => import("@/components/Footer").then((m) => m.Footer));

export default function HomePage() {
  return (
    <>
      <SkipLink />
      <Header />
      <main id="conteudo">
        <Hero />
        <Advantages />
        <CityTabs />
        <ExpansionBanner />
        <Quality />
        <ContactForm />
      </main>
      <Footer />
    </>
  );
}
