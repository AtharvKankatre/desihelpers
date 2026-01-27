import { useEffect } from "react";

// Extend the Window interface to include the adsbygoogle property
declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

const GoogleAdsBanner: React.FC = (props) => {
    useEffect(() => {
        try {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (err) {
          console.log(err);
        }
      }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{
        display: 'fit-content',
        overflow: 'hidden',        
      }} 
      data-ad-client={process.env.NEXT_PUBLIC_GOOGLE_ADS_CLIENT_ID}
      {...props}
    >
    </ins>
  );
};

export default GoogleAdsBanner;
