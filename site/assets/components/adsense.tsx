import React, { useEffect, useRef } from 'react';
import { Platform, View } from 'react-native';

const AdSenseBanner = () => {
  const adContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (Platform.OS !== 'web') return;

    // 1. Set the global configuration object that the script looks for
    (window as any).atOptions = {
      'key' : '9ef294a575410f41d555c0fb56041a3d',
      'format' : 'iframe',
      'height' : 90,
      'width' : 728,
      'params' : {}
    };

    // 2. Create the script element
    const script = document.createElement('script');
    script.src = "/invoke.js";
    script.async = true;

    // 3. Append it to the container
    if (adContainerRef.current) {
      adContainerRef.current.appendChild(script);
    }

    return () => {
      // Cleanup to prevent memory leaks or duplicate ads on re-renders
      if (adContainerRef.current) {
        adContainerRef.current.innerHTML = '';
      }
    };
  }, []);

  if (Platform.OS !== 'web') return null;

  return (
    <div 
      ref={adContainerRef} 
      style={{ 
        width: '728px', 
        height: '90px', 
        margin: '20px auto', 
        textAlign: 'center' 
      }} 
    />
  );
};

export default AdSenseBanner;