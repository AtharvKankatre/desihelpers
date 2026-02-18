// next-seo.config.ts
import { DefaultSeoProps } from 'next-seo';

const defaultSeoConfig: DefaultSeoProps = {
  title: 'DesiHelpers',
  description: 'DesiHelpers',
  canonical: process.env.NEXT_PUBLIC_Base_API_URL || 'https://dh.devapp.desihelpers.com/',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_Base_API_URL || 'https://dh.devapp.desihelpers.com/',
    site_name: 'dh.devapp.desihelpers.com',
  },
  twitter: {
    handle: '@yourtwitterhandle',
    site: '@yoursite',
    cardType: 'summary_large_image',
  },
};

export default defaultSeoConfig;

