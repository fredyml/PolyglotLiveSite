import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { SITE_CONFIG } from "./site.config.js";

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const outputDirectory = path.join(currentDirectory, "dist");
const assetsDirectory = path.join(outputDirectory, "assets");
const normalizedSiteUrl = new URL(SITE_CONFIG.siteUrl).toString();

function toAbsoluteUrl(value) {
  if (/^https?:\/\//i.test(value)) return new URL(value).toString();
  return new URL(value.replace(/^\/+/, ""), normalizedSiteUrl).toString();
}

function serializeJson(value) {
  return JSON.stringify(value, null, 2).replace(/<\//g, "<\\/");
}

const softwareApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: SITE_CONFIG.siteName,
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Windows 10 version 1703 or later, Windows 11",
  description:
    "Polyglot Live is a Windows audio application providing real-time, two-way voice translation for video calls, meetings, and desktop audio.",
  url: normalizedSiteUrl,
  author: {
    "@type": "Person",
    name: SITE_CONFIG.author,
    url: SITE_CONFIG.authorProfileUrl,
    image: toAbsoluteUrl("assets/fredy-mendoza.jpg"),
  },
  offers: [
    {
      "@type": "Offer",
      name: "Starter Monthly",
      price: "42.99",
      priceCurrency: "USD",
      description: "5 hours per month of real-time voice translation",
    },
    {
      "@type": "Offer",
      name: "Pro Monthly",
      price: "84.99",
      priceCurrency: "USD",
      description: "10 hours per month of real-time voice translation",
    },
    {
      "@type": "Offer",
      name: "Consultant Monthly",
      price: "164.99",
      priceCurrency: "USD",
      description: "20 hours per month of real-time voice translation",
    },
    {
      "@type": "Offer",
      name: "Flexible Time",
      price: "9.99",
      priceCurrency: "USD",
      description: "On-demand translation starting from 1 hour ($9.99 USD/hr, 30 days validity)",
    },
  ],
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: SITE_CONFIG.author,
  url: SITE_CONFIG.authorProfileUrl,
  jobTitle: "Software Developer",
  image: toAbsoluteUrl("assets/fredy-mendoza.jpg"),
  sameAs: [SITE_CONFIG.authorProfileUrl],
};

const faqItems = [
  {
    question: "What does Polyglot Live do?",
    answer:
      "Polyglot Live is a native Windows desktop app that translates your spoken voice into the listener's language and translates their incoming speech back into your language in real time during video calls, meetings, and voice chats.",
  },
  {
    question: "Does it work with Zoom, Microsoft Teams, Google Meet, and Discord?",
    answer:
      "Yes. Polyglot Live routes directly through Windows audio. It captures your microphone and sends live translated audio through your regular speaker or headphones, working smoothly across any calling app or browser without plugins.",
  },
  {
    question: "How long is my purchased time valid?",
    answer:
      "Both monthly subscriptions and one-time/flexible packages are valid for a 30-day monthly cycle from purchase. There is no daily usage cap—you can use all your hours whenever you need them within your period.",
  },
  {
    question: "How does authentication work?",
    answer:
      "Sign in with a single click using your existing Google account or personal Microsoft account (Outlook / Hotmail). No new passwords to remember, protected by official OAuth 2.0 with PKCE.",
  },
  {
    question: "Who develops Polyglot Live?",
    answer:
      "Polyglot Live is an independent software project created and maintained by software developer Fredy Mendoza, focused on native Windows performance, low latency, and responsive personal support.",
  },
  {
    question: "What are the system requirements?",
    answer:
      "A PC running Windows 10 (version 1703 or later) or Windows 11, a stable internet connection, a working microphone, and headphones or speakers.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map(({ question, answer }) => ({
    "@type": "Question",
    name: question,
    acceptedAnswer: {
      "@type": "Answer",
      text: answer,
    },
  })),
};

const template = await readFile(path.join(currentDirectory, "index.template.html"), "utf8");
const replacements = {
  "__LANG__": SITE_CONFIG.language,
  "__SITE_NAME__": SITE_CONFIG.siteName,
  "__TAGLINE__": SITE_CONFIG.tagline,
  "__TITLE__": "Polyglot Live | Real-Time Two-Way Voice Translation for Windows",
  "__DESCRIPTION__":
    "Speak in your language and communicate globally in real time during video calls and meetings on Windows. Created by Fredy Mendoza.",
  "__CANONICAL_URL__": normalizedSiteUrl,
  "__SOCIAL_IMAGE_URL__": toAbsoluteUrl(SITE_CONFIG.socialImage),
  "__AUTHOR__": SITE_CONFIG.author,
  "__AUTHOR_URL__": SITE_CONFIG.authorProfileUrl,
  "__CONTACT_EMAIL__": SITE_CONFIG.contactEmail,
  "__CONTACT_URL__": SITE_CONFIG.contactUrl,
  "__INSTALLER_URL__": SITE_CONFIG.installerUrl,
  "__BASE_PATH__": SITE_CONFIG.basePath,
  "__SOFTWARE_APPLICATION_SCHEMA__": serializeJson(softwareApplicationSchema),
  "__PERSON_SCHEMA__": serializeJson(personSchema),
  "__FAQ_SCHEMA__": serializeJson(faqSchema),
};

const html = Object.entries(replacements).reduce(
  (result, [placeholder, value]) => result.replaceAll(placeholder, value),
  template,
);

await mkdir(assetsDirectory, { recursive: true });
await Promise.all([
  writeFile(path.join(outputDirectory, "index.html"), html),
  copyFile(path.join(currentDirectory, "styles.css"), path.join(outputDirectory, "styles.css")),
  copyFile(path.join(currentDirectory, "main.js"), path.join(outputDirectory, "main.js")),
  copyFile(path.join(currentDirectory, "site.config.js"), path.join(outputDirectory, "site.config.js")),
  copyFile(
    path.join(currentDirectory, "assets", "fredy-mendoza.jpg"),
    path.join(assetsDirectory, "fredy-mendoza.jpg"),
  ),
  copyFile(
    path.join(currentDirectory, "assets", "polyglot-live-icon.png"),
    path.join(assetsDirectory, "polyglot-live-icon.png"),
  ),
  copyFile(
    path.join(currentDirectory, "assets", "polyglot-live-logo.svg"),
    path.join(assetsDirectory, "polyglot-live-logo.svg"),
  ),
  copyFile(
    path.join(currentDirectory, "assets", "polyglot-live-interface.png"),
    path.join(assetsDirectory, "polyglot-live-interface.png"),
  ),
  writeFile(path.join(outputDirectory, ".nojekyll"), ""),
  writeFile(
    path.join(outputDirectory, "robots.txt"),
    `User-agent: *\nAllow: /\n\nSitemap: ${toAbsoluteUrl("sitemap.xml")}\n`,
  ),
  writeFile(
    path.join(outputDirectory, "sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${normalizedSiteUrl}</loc>\n  </url>\n</urlset>\n`,
  ),
]);

console.log(`Successfully built ${SITE_CONFIG.siteName} in ${outputDirectory}`);
