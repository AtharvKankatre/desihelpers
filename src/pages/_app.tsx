import "bootstrap/dist/css/bootstrap.min.css";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import "bootstrap/dist/css/bootstrap.css";
import { CGlobalLayout } from "@/components/global/header/CGlobalLayout";
import { useEffect } from "react";
import { AuthProvider } from "@/services/authorization/AuthContext";
import Head from 'next/head';
import { useRouter } from 'next/router';
import { HelmetProvider } from "react-helmet-async";
const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GOOGLEANALYTICS_TRACKINGID;

export default function App({ Component, pageProps}: AppProps) {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      window.gtag('config', GA_TRACKING_ID, {
        page_path: url,
      });
    };
    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);


  useEffect(() => {
    require("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);
  return (
    <>
    <Head>
    {/* Global Site Tag (gtag.js) - Google Analytics */}
    <script
      async
      src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
    />
    <script
      dangerouslySetInnerHTML={{
        __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_TRACKING_ID}', {
            page_path: window.location.pathname,
          });
        `,
      }}
    />
  </Head>
    <AuthProvider>
      <CGlobalLayout>
      <HelmetProvider> <Component {...pageProps} /></HelmetProvider>
      </CGlobalLayout>{" "}
    </AuthProvider>
    </>
  );
}
