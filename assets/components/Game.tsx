import React, { useRef, useState, useMemo, useCallback } from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  Animated,
  Platform,
  ImageSourcePropType,
  Touchable,
} from 'react-native';
import { Octokit } from 'octokit';
import { gameIcons } from '@/assets/data/GameIcons';
import { BookKey } from 'lucide-react-native';
import { Linking } from 'react-native';

const PLACEHOLDER: ImageSourcePropType = {
  uri: 'https://placehold.co/200?text=?',
};

const octokit = new Octokit();

export function Game({
  name,
  imageSource,
  onPress,
  ban = false,
  broken = false,
  issueId,
  onTooltipToggle,
}: {
  name: string;
  imageSource: string;
  onPress: () => void;
  ban?: boolean;
  broken?: boolean;
  issueId?: string;
  onTooltipToggle?: (visible: boolean) => void;
}) {
  const icons = gameIcons();

  const [errorText, setErrorText] = useState<string | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);

  const tooltipOpacity = useRef(new Animated.Value(0)).current;
  const tooltipTranslate = useRef(new Animated.Value(6)).current;

  const fetchErrorDetails = useCallback(async () => {
    if (!issueId) return;

    try {
      const { data } = await octokit.request(
        'GET /repos/sparkly-games/sparkly/issues/{issue_number}',
        { issue_number: issueId }
      );

      setErrorText(data.body || 'No details provided.');
      setShowTooltip(true);
      onTooltipToggle?.(true);

      tooltipOpacity.setValue(0);
      tooltipTranslate.setValue(6);

      Animated.parallel([
        Animated.timing(tooltipOpacity, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.timing(tooltipTranslate, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start();
    } catch {
      setErrorText('Failed to fetch issue details.');
      setShowTooltip(true);
      onTooltipToggle?.(true);
    }
  }, [issueId]);

  const hideTooltip = useCallback(() => {
    Animated.parallel([
      Animated.timing(tooltipOpacity, {
        toValue: 0,
        duration: 140,
        useNativeDriver: true,
      }),
      Animated.timing(tooltipTranslate, {
        toValue: 6,
        duration: 140,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowTooltip(false);
      setErrorText(null);
      onTooltipToggle?.(false);
    });
  }, []);

  const baseIcon = useMemo(() => {
    const icon = icons[imageSource];
    return typeof icon === 'string'
      ? { uri: icon }
      : icon || PLACEHOLDER;
  }, [icons, imageSource]);

  const hover = useRef(new Animated.Value(1)).current;
  const fade = useRef(new Animated.Value(0)).current;

  const [img, setImg] = useState<ImageSourcePropType>(baseIcon);

  if (img !== baseIcon) setImg(baseIcon);

  const pressAnim = useCallback((to: number) => {
    Animated.spring(hover, {
      toValue: to,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleLoad = useCallback(() => {
    fade.setValue(0);
    Animated.timing(fade, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleError = useCallback(() => {
    setImg(PLACEHOLDER);
  }, []);

  return (
    <View style={styles.wrapper}>
      <Animated.View style={{ transform: [{ scale: hover }] }}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={!ban ? onPress : undefined}
          onPressIn={() => pressAnim(0.96)}
          onPressOut={() => pressAnim(1)}
          disabled={ban}
          style={[styles.card, ban && styles.bannedOpacity]}
        >
          <View style={styles.imageFrame}>
            <Animated.Image
              source={img}
              style={[styles.image, { opacity: fade }]}
              resizeMode="cover"
              onLoad={handleLoad}
              onError={handleError}
            />

            {broken && (
              <View style={styles.broken}>
                <TouchableOpacity
                  onPress={() => {
                    if (showTooltip) hideTooltip();
                    else fetchErrorDetails();
                  }}
                >
                  <Text style={styles.brokenText}>⚠</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <View style={styles.textBox}>
            <Text numberOfLines={1} style={styles.title}>
              {name}
            </Text>
          </View>

          {ban && (
            <View style={styles.lock}>
              <Text style={styles.lockText}>🔒</Text>
            </View>
          )}
        </TouchableOpacity>
      </Animated.View>

      {showTooltip && errorText && (
        <Animated.View
          style={[
            styles.tooltip,
            {
              opacity: tooltipOpacity,
              transform: [{ translateY: tooltipTranslate }],
            },
          ]}
        >
          <Text style={styles.tooltipText} numberOfLines={6}>
            {errorText}
          </Text>
          <Text style={styles.tooltipLink} onPress={() => { Linking.openURL(`https://github.com/sparkly-games/sparkly/issues/${issueId}`) }}>
            Open in GitHub
          </Text>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
  },

  card: {
    overflow: 'hidden',
    borderRadius: 22,
    padding: 10,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },

  imageFrame: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 16,
    backgroundColor: '#000',
    overflow: 'hidden',
  },

  image: { width: '100%', height: '100%' },

  textBox: { marginTop: 10, height: 20, justifyContent: 'center', width: '100%' },

  title: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },

  broken: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: 'rgba(239,68,68,0.9)',
    borderRadius: 6,
    paddingHorizontal: 6,
  },

  brokenText: { color: '#fff', fontSize: 30 },

  tooltip: {
    position: 'absolute',
    right: -190,
    top: -10,
    width: 180,
    backgroundColor: 'rgba(70, 0, 0, 0.95)',
    borderRadius: 10,
    padding: 10,
    zIndex: 999,
  },

  tooltipText: {
    color: '#ffffff',
    fontSize: 11,
  },

  tooltipLink: {
    color: '#ff6b6b',
    margin: 5,
    fontSize: 11,
    textAlign: 'auto',
    fontWeight: '600',
  },

  lock: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(2,6,23,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  lockText: { fontSize: 32 },

  bannedOpacity: { opacity: 0.4 },
});