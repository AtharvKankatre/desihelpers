import "@/styles/globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
// FontAwesome: import core CSS manually for Next.js (prevents giant unsized SVG icons)
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false; // Prevent FA from injecting CSS dynamically (causes FOUC in SSR)
import type { AppProps } from "next/app";
import { CGlobalLayout } from "@/components/global/header/CGlobalLayout";
import { PageLoader } from "@/components/global/loader/PageLoader";
import { useEffect } from "react";
import { AuthProvider } from "@/services/authorization/AuthContext";
import Head from 'next/head';
import Script from 'next/script';
import { useRouter } from 'next/router';
import { HelmetProvider } from "react-helmet-async";
import { NotificationProvider } from "@/context/NotificationContext";
import { ToastContainer } from "react-toastify";

const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GOOGLEANALYTICS_TRACKINGID;

export default function App({ Component, pageProps }: AppProps) {
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
      <AuthProvider>
        <NotificationProvider>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss={false}
            draggable
            pauseOnHover
            theme="colored"
            style={{ zIndex: 99999 }}
            toastStyle={{ fontSize: '14px', borderRadius: '10px', minHeight: '50px' }}
          />
          <PageLoader />
          <CGlobalLayout>
            <HelmetProvider> <Component {...pageProps} /></HelmetProvider>
          </CGlobalLayout>{" "}
        </NotificationProvider>
      </AuthProvider>
    </>
  );
}
