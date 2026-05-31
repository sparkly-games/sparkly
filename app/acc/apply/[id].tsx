import React, { useEffect, useRef, useState, memo } from 'react'; 
import ENV_VARS from '@/assets/data/env';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Pressable,
  useWindowDimensions,
  FlatList,
  TextInput,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

const JOBS = [
  {
    id: 'ui-designer',
    title: 'UI Designer',
    type: 'Volunteer',
    description: 'Design sleek, modern interfaces for an unblocked games platform.',
  },
  {
    id: 'frontend-dev',
    title: 'Frontend Developer',
    type: 'Volunteer',
    description: 'Build fast, responsive UI in React Native / React.',
  },
  {
    id: 'game-curator',
    title: 'Game Curator',
    type: 'Volunteer',
    description: 'Help select and organise high-quality games for the platform.',
  },
];

const JobCard = memo(({ job, onApply }: any) => {
  return (
    <View style={styles.card}>
      <Text style={styles.jobTitle}>{job.title}</Text>
      <Text style={styles.jobType}>{job.type}</Text>
      <Text style={styles.jobDesc}>{job.description}</Text>

      <Pressable
        style={({ pressed }) => [
          styles.applyButton,
          pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] },
        ]}
        onPress={() => onApply(job.id)}
      >
        <Text style={styles.applyText}>Apply</Text>
      </Pressable>
    </View>
  );
});

export default function ApplyScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { id } = useLocalSearchParams();

  const isDesktop = width >= 1024;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const job = JOBS.find((j) => j.id === id);

  const WEBHOOK = ENV_VARS.JOB_WEBHOOK;

  const [form, setForm] = useState({
    name: '',
    message: '',
    phone: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 700,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleApply = (jobId: string) => {
    router.push(`/acc/apply/${jobId}`);
  };

  const submitApplication = async () => {
    if (!job || !WEBHOOK) return;

    setSubmitting(true);

    try {
      await fetch(WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          embeds: [
            {
              title: `New Application: ${job.title}`,
              color: 0x2563eb,
              fields: [
                { name: 'Role', value: job.title },
                { name: 'Name', value: form.name || 'Not provided' },
                { name: 'Phone', value: form.phone || 'Not provided' },
                { name: 'Message', value: form.message || 'None' },
              ],
              timestamp: new Date().toISOString(),
            },
          ],
        }),
      });

      setSubmitted(true);
    } catch (e) {
      console.error('Webhook error:', e);
    } finally {
      setSubmitting(false);
    }
  };

  // ---------------- APPLY DETAIL VIEW ----------------
  if (id && job) {
    return (
      <View style={styles.container}>
        <Animated.View style={[styles.detailContainer, { opacity: fadeAnim }]}>
          <Text style={styles.header}>{job.title}</Text>
          <Text style={styles.subheader}>{job.description}</Text>

          <TextInput
            placeholder="Your name"
            placeholderTextColor="#64748b"
            style={styles.input}
            value={form.name}
            onChangeText={(t) => setForm((p) => ({ ...p, name: t }))}
          />
          <TextInput
            placeholder="Mobile Phone"
            placeholderTextColor="#64748b"
            style={styles.input}
            value={form.phone}
            onChangeText={(t) => setForm((p) => ({ ...p, phone: t }))}
          />

          <TextInput
            placeholder="Why do you want this role?"
            placeholderTextColor="#64748b"
            multiline
            style={[styles.input, { height: 120 }]}
            value={form.message}
            onChangeText={(t) => setForm((p) => ({ ...p, message: t }))}
          />

          <Pressable
            style={({ pressed }) => [
              styles.submitButton,
              pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] },
            ]}
            onPress={submitApplication}
            disabled={submitting || submitted}
          >
            <Text style={styles.submitText}>
              {submitted
                ? 'Submitted ✓'
                : submitting
                  ? 'Sending...'
                  : 'Submit Application'}
            </Text>
          </Pressable>

          {submitted && (
            <Text style={{ color: '#22c55e', marginTop: 12 }}>
              Application sent.
            </Text>
          )}

          <Pressable onPress={() => router.replace('/acc/apply/jobs')}>
            <Text style={styles.backText}>← Back to roles</Text>
          </Pressable>
        </Animated.View>
      </View>
    );
  }

  // ---------------- LIST VIEW ----------------
  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          isDesktop && styles.desktopContent,
          { opacity: fadeAnim },
        ]}
      >
        <Text style={styles.header}>JOIN THE TEAM</Text>
        <Text style={styles.subheader}>
          Choose a role and help build the platform.
        </Text>

        <FlatList
          data={JOBS}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <JobCard job={item} onApply={handleApply} />
          )}
          numColumns={isDesktop ? 2 : 1}
          columnWrapperStyle={isDesktop ? styles.row : undefined}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
    flexDirection: 'row',
  },

  content: {
    flex: 1,
    padding: 24,
  },

  desktopContent: {
    maxWidth: '70%',
  },

  header: {
    fontSize: 42,
    fontWeight: '900',
    color: '#fff',
  },

  subheader: {
    fontSize: 16,
    color: '#94a3b8',
    marginTop: 8,
    marginBottom: 24,
  },

  card: {
    flex: 1,
    backgroundColor: '#0f172a',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.15)',
  },

  jobTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
  },

  jobType: {
    fontSize: 12,
    color: '#3b82f6',
    marginTop: 4,
    fontWeight: '700',
  },

  jobDesc: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 10,
  },

  applyButton: {
    marginTop: 16,
    backgroundColor: '#2563eb',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },

  applyText: {
    color: '#fff',
    fontWeight: '800',
  },

  detailContainer: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    maxWidth: 700,
  },

  input: {
    backgroundColor: '#0f172a',
    borderRadius: 12,
    padding: 14,
    marginTop: 14,
    color: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.15)',
  },

  submitButton: {
    marginTop: 20,
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },

  submitText: {
    color: '#fff',
    fontWeight: '800',
  },

  backText: {
    color: '#94a3b8',
    marginTop: 16,
  },

  row: {
    justifyContent: 'space-between',
    gap: 16,
  },
});