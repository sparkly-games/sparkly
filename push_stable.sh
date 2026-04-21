#!/bin/zsh

# Define paths relative to the script location
APP_DIR="./app"
CANARY_DIR="$APP_DIR/canary"
STABLE_DIR="$APP_DIR/stable"
DEVPATCH_DIR="$APP_DIR/devpatch"

echo "🚀 Starting Sync: Canary -> Stable..."

# 1. Check if Canary exists
if [ ! -d "$CANARY_DIR" ]; then
    echo "❌ Error: Canary directory not found at $CANARY_DIR"
    exit 1
fi

# 2. Create Stable if it doesn't exist, or clear it if it does
if [ -d "$STABLE_DIR" ]; then
    echo "🧹 Clearing old Stable build..."
    rm -rf "$STABLE_DIR/*"
else
    echo "📂 Creating Stable directory..."
    mkdir -p "$STABLE_DIR"
fi

# 3. Copy files
echo "📦 Copying Canary files to Stable..."
cp -R "$CANARY_DIR/"* "$STABLE_DIR/"

# 4. Cleanup (Remove .DS_Store files which can cause issues)
find "$STABLE_DIR" -name ".DS_Store" -depth -exec rm {} \;

echo "✅ Sync Complete! Your Canary features are now Live in Stable."

echo "🚀 Starting Sync: Devpatch -> Canary"

rm -rf $CANARY_DIR
mkdir -p $CANARY_DIR

cp -R "$DEVPATCH_DIR/"* "$CANARY_DIR/"

echo "✅ Synced Devpatch to Canary!"
echo "📝 Make sure to run again to sync to Stable!"

echo "🔔 Don't forget to restart your Expo server if changes aren't reflecting."