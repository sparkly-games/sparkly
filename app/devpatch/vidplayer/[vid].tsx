import React from "react";
import { useLocalSearchParams } from "expo-router";

const map: Record<string, string> = {
  'stealth-thorpe-park': 'https://raw.githubusercontent.com/sparkly-games/videos/refs/heads/main/thorpe-park/stealth-2023.mp4',
  'colossus-thorpe-park': 'https://raw.githubusercontent.com/sparkly-games/videos/refs/heads/main/thorpe-park/colossus.mp4',
  'saw-thorpe-park': 'https://raw.githubusercontent.com/sparkly-games/videos/refs/heads/main/thorpe-park/saw.mp4',
  '13-thorpe-park': 'https://raw.githubusercontent.com/sparkly-games/videos/refs/heads/main/alton-towers/13.mp4',
  'bazinga-tbbt': 'https://raw.githubusercontent.com/sparkly-games/videos/refs/heads/main/tbbt:bazinga-s3e15.mp4',
};

export default function VidPlayer() {
  // useLocalSearchParams automatically grabs [vid] from the URL
  const { vid } = useLocalSearchParams<{ vid: string }>();

  // Use a fallback to prevent map[undefined] errors
  const videoSrc = vid ? map[vid] : null;

  return (
    <div style={{ 
      flex: 1, 
      backgroundColor: 'black', 
      height: '100vh', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center' 
    }}>
      {videoSrc ? (
        <video 
          key={vid} // Important: keeps the player in sync when the URL changes
          src={videoSrc} 
          controls 
          autoPlay 
          style={{ width: '100%', height: '100%' }} 
        />
      ) : (
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: 'white' }}>
            {vid ? `Video "${vid}" not found` : "Loading..."}
          </p>
        </div>
      )}
    </div>
  );
}