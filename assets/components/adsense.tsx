import React, { useEffect, useRef } from 'react';
import { Platform } from 'react-native';

const AdSenseBanner = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (Platform.OS !== 'web') return;

    const loadAd = () => {
      // Only push if the container actually has a width now
      if (containerRef.current && containerRef.current.offsetWidth > 0) {
        try {
          ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
        } catch (e) {
          console.error("AdSense error:", e);
        }
      } else {
        // If width is still 0, wait 100ms and try one more time
        setTimeout(loadAd, 100);
      }
    };

    loadAd();
  }, []);

  if (Platform.OS !== 'web') return null;

  return (
    /* 1. We wrap it in a div with a minWidth or specific width */
    <div 
      ref={containerRef}
      style={{ 
        width: '100%', 
        minHeight: '90px', // Prevents layout shift
        margin: '20px 0', 
        textAlign: 'center' 
      }}
    >
      <ins
        className="adsbygoogle"
        style={{ display: 'block', minWidth: '250px' }} // 2. Set a minWidth here
        data-ad-client="ca-pub-5114925324085905"
        data-ad-slot="1228236313"
        data-ad-format="auto"
        data-adtest="on"
        data-full-width-responsive="true"
      />
    </div>
  );
};

export default AdSenseBanner;