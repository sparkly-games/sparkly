import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

export default function ImportExportScreen() {
  const [status, setStatus] = useState('');

  // EXPORT
  const handleExport = () => {
    try {
      const data: Record<string, string> = {};

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key) continue;
        data[key] = localStorage.getItem(key) as string;
      }

      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json',
      });

      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = 'sparkly-backup.json';
      a.click();

      URL.revokeObjectURL(url);

      setStatus('Export successful');
    } catch (err) {
      setStatus('Export failed');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Data Manager</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Export Data</Text>
        <Text style={styles.cardDesc}>
          Download all your saved data as a backup file.
        </Text>

        <TouchableOpacity style={styles.button} onPress={handleExport}>
          <Text style={styles.buttonText}>Download Backup</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.card, styles.cardDisabled]}>
        <Text style={styles.cardTitle}>Import Data</Text>
        <Text style={styles.cardDesc}>
          Upload a backup file to restore your data.
        </Text>

        <TouchableOpacity style={[styles.button, styles.buttonDisabled]} disabled>
          <Text style={styles.buttonText}>Coming Soon</Text>
        </TouchableOpacity>
      </View>

      {status ? <Text style={styles.status}>{status}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
    padding: 20,
  },

  title: {
    color: '#60a5fa',
    fontSize: 26,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 20,
  },

  card: {
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },

  cardDisabled: {
    opacity: 0.5,
  },

  cardTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 6,
  },

  cardDesc: {
    color: '#94a3b8',
    fontSize: 13,
    marginBottom: 14,
  },

  button: {
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },

  buttonDisabled: {
    backgroundColor: '#6b7280',
  },

  buttonText: {
    color: '#fff',
    fontWeight: '800',
  },

  status: {
    textAlign: 'center',
    marginTop: 12,
    color: '#94a3b8',
  },
});