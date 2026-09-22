import { useEffect } from "react";

const DEFAULT_TITLE = "Sathi Meet - India's #1 Dating, Social Companion & Lifestyle Support Platform";
const DEFAULT_DESC = "Sathi Meet (www.sathimeet.com) is India's leading social companion, dating and lifestyle support platform. Connect with 100% ID-verified companions for coffee dates, movie partners, dinner hangouts, travel buddies, elder care and professional lifestyle assistance across India.";
const SITE_URL = "https://www.sathimeet.com";

const SEO = ({
  title,
  description = DEFAULT_DESC,
  keywords = "Sathi Meet, SathiMeet, sathimeet.com, social companion India, dating companion India, verified dating India, coffee date partner, movie partner, elder care India, shopping buddy, travel companion India, rent a companion India",
  canonical = "/",
  ogImage = "https://www.sathimeet.com/Sathi_Meet_Logo.png",
  ogType = "website",
}) => {
  useEffect(() => {
    // 1. Page Title
    const fullTitle = title
      ? (title.includes("Sathi Meet") ? title : `${title} | Sathi Meet`)
      : DEFAULT_TITLE;
    document.title = fullTitle;

    // Helper to update or create meta tags
    const updateMeta = (nameAttr, nameVal, content) => {
      let element = document.querySelector(`meta[${nameAttr}="${nameVal}"]`);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(nameAttr, nameVal);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content || "");
    };

    // 2. Standard Meta
    updateMeta("name", "title", fullTitle);
    updateMeta("name", "description", description);
    if (keywords) {
      updateMeta("name", "keywords", keywords);
    }

    // 3. OpenGraph
    const cleanCanonical = canonical.startsWith("/") ? canonical : `/${canonical}`;
    const pageUrl = `${SITE_URL}${cleanCanonical}`;
    updateMeta("property", "og:title", fullTitle);
    updateMeta("property", "og:description", description);
    updateMeta("property", "og:type", ogType);
    updateMeta("property", "og:image", ogImage);
    updateMeta("property", "og:url", pageUrl);
    updateMeta("property", "og:site_name", "Sathi Meet");

    // 4. Twitter Card
    updateMeta("name", "twitter:title", fullTitle);
    updateMeta("name", "twitter:description", description);
    updateMeta("name", "twitter:image", ogImage);
    updateMeta("name", "twitter:url", pageUrl);

    // 5. Canonical Link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute("href", pageUrl);
  }, [title, description, keywords, canonical, ogImage, ogType]);

  return null;
};

export default SEO;
