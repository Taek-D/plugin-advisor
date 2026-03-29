import Script from "next/script";

export default function UmamiScript() {
  const websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
  if (!websiteId) return null;
  return (
    <Script
      async
      src="https://cloud.umami.is/script.js"
      data-website-id={websiteId}
      data-host-url={process.env.NEXT_PUBLIC_UMAMI_PROXY_URL}
      strategy="afterInteractive"
    />
  );
}
