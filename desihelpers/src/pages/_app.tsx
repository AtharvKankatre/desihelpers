import "bootstrap/dist/css/bootstrap.min.css";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import "bootstrap/dist/css/bootstrap.css";
import { CGlobalLayout } from "@/components/global/header/CGlobalLayout";
import { useEffect } from "react";
import { AuthProvider } from "@/services/authorization/AuthContext";
import Head from 'next/head';
import Script from 'next/script';
import { useRouter } from 'next/router';
import { HelmetProvider } from "react-helmet-async";
import { OutstandingLoader } from "@/components/static/OutstandingLoader";
import { useLoaderStore } from "@/stores/LoaderStore";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GOOGLEANALYTICS_TRACKINGID;

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const { showLoader, hideLoader } = useLoaderStore();
  const [queryClient] = useState(() => new QueryClient());

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      window.gtag('config', GA_TRACKING_ID, {
        page_path: url,
      });
    };
    router.events.on('routeChangeComplete', handleRouteChange);

    const handleStart = () => showLoader();
    const handleComplete = () => hideLoader();

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router.events, showLoader, hideLoader]);


  useEffect(() => {
    require("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);
  return (
    <>
      <Head>
        <title>DesiHelpers | Find Help Fast &amp; Easy In Your Community | Nanny, Caterers, Bakers, Tutors and many more</title>
      </Head>
      {/* Global Site Tag (gtag.js) - Google Analytics */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
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
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <OutstandingLoader />
          <CGlobalLayout>
            <HelmetProvider> <Component {...pageProps} /></HelmetProvider>
          </CGlobalLayout>{" "}
        </AuthProvider>
      </QueryClientProvider>
    </>
  );
}
