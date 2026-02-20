import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Meta tags for SEO */}
        <meta property="fb:app_id" content={`${process.env.FACEBOOK_APP_ID}`}></meta>
        <meta
          name="description"
          content="DesiHelpers makes it easy to find help in your community for nanny services, caterers, bakers, tutors, and more. Connect with trusted professionals near you!"
        />
        <meta property="og:image" content={`${process.env.NEXT_PUBLIC_Base_API_URL}DH-SocialMedia_Banner.png`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:type" content="website" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap" rel="stylesheet" />
      </Head>
      <body>
        {/* Google AdSense - placed in body using next/script */}
        <Script
          strategy="afterInteractive"
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_GOOGLE_ADS_CLIENT_ID}`}
          crossOrigin="anonymous"
        />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
