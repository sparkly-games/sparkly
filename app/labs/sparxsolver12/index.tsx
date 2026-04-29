import React, { useState } from "react";
import MathView from "@/assets/components/MathView";
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
} from "react-native";

export default function SparxSolverLab12() {
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = async () => {
      try {
        const result = reader.result as string;
        const base64 = result.split(",")[1];

        if (!base64) throw new Error("Failed to read image");

        await askAI(base64);
      } catch (err: any) {
        setError(err.message || "Failed to process image");
      }
    };

    reader.readAsDataURL(file);
  };

  const askAI = async (base64Image: string) => {
    try {
      setLoading(true);
      setResponse(null);
      setError(null);

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${process.env.EXPO_PUBLIC_GOOGLE_AI_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [
                  {
                    text:
                      "You are a maths tutor. Return clean LaTeX steps and final answer in \\boxed{}.",
                  },
                  {
                    inlineData: {
                      mimeType: "image/jpeg",
                      data: base64Image,
                    },
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.2,
            },
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error?.message || "Request failed");
      }

      const text =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ??
        "No response";

      setResponse(text);
    } catch (err: any) {
      setError(err.message || "Error getting AI response");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>AI Maths Solver</Text>
        <Text style={styles.subtitle}>
          Upload a question and get step-by-step solutions
        </Text>
      </View>

      {/* Upload area */}
      <View style={styles.card}>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />
      </View>

      {/* Loading */}
      {loading && (
        <View style={styles.loadingCard}>
          <ActivityIndicator color="#4da3ff" />
          <Text style={styles.loadingText}>Solving your question...</Text>
        </View>
      )}

      {/* Error */}
      {error && (
        <View style={styles.errorCard}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Output */}
      <ScrollView style={styles.outputContainer}>
        {response && (
          <View style={styles.outputCard}>
            <MathView latex={response} />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#06142e", // deep blue
  },

  header: {
    marginBottom: 16,
  },

  title: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "700",
  },

  subtitle: {
    color: "#8fb4ff",
    marginTop: 4,
    fontSize: 13,
  },

  card: {
    backgroundColor: "#1c488a",
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#1f3d73",
    marginBottom: 12,
  },

  loadingCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 10,
  },

  loadingText: {
    color: "#8fb4ff",
  },

  errorCard: {
    backgroundColor: "#2a1b2e",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ff4d6d",
    marginBottom: 10,
  },

  errorText: {
    color: "#ff7b8a",
  },

  outputContainer: {
    marginTop: 10,
  },

  outputCard: {
    backgroundColor: "#0b1f3a",
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#1f3d73",
  },
});