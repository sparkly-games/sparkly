const ENV_VARS = {
  FIREBASE_API_KEY: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  GOOGLE_AI_KEY: process.env.EXPO_PUBLIC_GOOGLE_AI_KEY,
  YT_API_KEY: process.env.EXPO_PUBLIC_YT_API_KEY,
  COBALT_URL: process.env.EXPO_PUBLIC_COBALT_URL,
  USE_STATUSPAGE: process.env.EXPO_PUBLIC_USE_STATUSPAGE,
  USE_ANALYTICS: process.env.EXPO_PUBLIC_USE_ANALYTICS,
  STATUSPAGE_URL: process.env.EXPO_PUBLIC_STATUSPAGE_URL,
  JOB_WEBHOOK: process.env.EXPO_PUBLIC_JOB_WEBHOOK,
  SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
  SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
};

// Log a warning if a key is missing during development
if (__DEV__) {
  Object.entries(ENV_VARS).forEach(([key, value]) => {
    if (!value) console.warn(`⚠️ Configuration Warning: ${key} is not defined in your .env file.`);
  });
}

export default ENV_VARS;