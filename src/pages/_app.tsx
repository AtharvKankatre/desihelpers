import "@/styles/globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
// FontAwesome: import core CSS manually for Next.js (prevents giant unsized SVG icons)
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false; // Prevent FA from injecting CSS dynamically (causes FOUC in SSR)
import type { AppProps } from "next/app";
import type { NextComponentType, NextPageContext } from 'next';
import { CGlobalLayout } from "@/components/global/header/CGlobalLayout";
import { PageLoader } from "@/components/global/loader/PageLoader";
import { useEffect } from "react";
import { AuthProvider, useAuth } from "@/services/authorization/AuthContext";
import Head from 'next/head';
import Script from 'next/script';
import { useRouter } from 'next/router';
import { HelmetProvider } from "react-helmet-async";
import { NotificationProvider } from "@/context/NotificationContext";
import { ToastContainer } from "react-toastify";
import { chatService } from "@/services/chat/chatService";

const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GOOGLEANALYTICS_TRACKINGID;

interface AppContentProps {
  Component: NextComponentType<NextPageContext, any, any>;
  pageProps: any;
}

function AppContent({ Component, pageProps }: AppContentProps) {
  const router = useRouter();
  const { isActive } = useAuth();

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

  // Global Chat Connection — connect when authenticated, disconnect on logout
  useEffect(() => {
    if (isActive) {
      chatService.connect();
    } else {
      chatService.disconnect();
    }
  }, [isActive]);

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
        </CGlobalLayout>
      </NotificationProvider>
    </>
  );
}

export default function App(props: AppProps) {
  return (
    <AuthProvider>
      <AppContent Component={props.Component} pageProps={props.pageProps} />
    </AuthProvider>
  );
}
