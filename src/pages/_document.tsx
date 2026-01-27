import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Google AdSense */}
        <script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_GOOGLE_ADS_CLIENT_ID}`}
          crossOrigin="anonymous"
        ></script>

        {/* Meta tags for SEO */}
        <title>DesiHelpers | Find Help Fast & Easy In Your Community | Nanny, Caterers, Bakers, Tutors and many more</title>
        <meta property="fb:app_id" content={`${process.env.FACEBOOK_APP_ID}`}></meta>
        <meta
          name="description"
          content="DesiHelpers makes it easy to find help in your community for nanny services, caterers, bakers, tutors, and more. Connect with trusted professionals near you!"
        />
          <meta property="og:image"  content={`${process.env.NEXT_PUBLIC_Base_API_URL}DH-SocialMedia_Banner.png`}/>
           <meta property="og:image:width" content="1200" />
           <meta property="og:image:height" content="630" />
        <meta property="og:type" content="website"/>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
