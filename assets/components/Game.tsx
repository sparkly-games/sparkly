import React, {
  useRef,
  useState,
  useMemo,
  useCallback,
  useEffect,
} from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  Animated,
  ImageSourcePropType,
  Linking,
} from 'react-native';
import { Octokit } from 'octokit';
import ENV_VARS from '../data/env';

const PLACEHOLDER: ImageSourcePropType = {
  uri: 'https://placehold.co/200?text=?',
};

const octokit = new Octokit();

type Props = {
  name: string;
  imageSource: string;
  onPress: () => void;
  ban?: boolean;
  broken?: boolean;
  fixed?: boolean;
  issueId?: string;
  untested?: boolean;
  leaving?: boolean;
  onTooltipToggle?: (visible: boolean) => void;
};

export const Game = React.memo(function Game({
  name,
  imageSource,
  fixed = false,
  onPress,
  leaving = false,
  ban = false,
  broken = false,
  untested = false,
  issueId,
  onTooltipToggle,
}: Props) {
  const [errorText, setErrorText] = useState<string | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);

  const tooltipOpacity = useRef(new Animated.Value(0)).current;
  const tooltipTranslate = useRef(new Animated.Value(6)).current;

  const hover = useRef(new Animated.Value(1)).current;
  const fade = useRef(new Animated.Value(0)).current;

  const baseIcon = useMemo<ImageSourcePropType>(() => {
    return {
      uri: `https://res.cloudinary.com/${ENV_VARS.CLOUDINARY_CLOUD_NAME}/image/upload/f_auto,q_auto/v1779133665/${imageSource}`,
    };
  }, [imageSource]);

  const [img, setImg] = useState<ImageSourcePropType>(baseIcon);

  useEffect(() => {
    setImg(baseIcon);
  }, [baseIcon]);

  const showTooltipAnimated = useCallback(() => {
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
  }, [onTooltipToggle, tooltipOpacity, tooltipTranslate]);

  const fetchErrorDetails = useCallback(async () => {
    if (!issueId) return;

    if (errorText) {
      showTooltipAnimated();
      return;
    }

    try {
      const { data } = await octokit.request(
        'GET /repos/sparkly-games/sparkly/issues/{issue_number}',
        {
          issue_number: issueId,
        }
      );

      setErrorText(data.body || 'No details provided.');
      showTooltipAnimated();
    } catch {
      setErrorText('Failed to fetch issue details.');
      showTooltipAnimated();
    }
  }, [issueId, errorText, showTooltipAnimated]);

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
      onTooltipToggle?.(false);
    });
  }, [onTooltipToggle, tooltipOpacity, tooltipTranslate]);

  const pressAnim = useCallback(
    (to: number) => {
      Animated.spring(hover, {
        toValue: to,
        useNativeDriver: true,
      }).start();
    },
    [hover]
  );

  const handleLoad = useCallback(() => {
    fade.setValue(0);

    Animated.timing(fade, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [fade]);

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
                  hitSlop={8}
                  onPress={() => {
                    if (showTooltip) {
                      hideTooltip();
                    } else {
                      fetchErrorDetails();
                    }
                  }}
                >
                  <Text style={styles.brokenText}>⚠</Text>
                </TouchableOpacity>
              </View>
            )}
            {fixed && (
              <View style={styles.fixed}>
                <TouchableOpacity
                  hitSlop={8}
                  onPress={() => {
                    if (showTooltip) {
                      hideTooltip();
                    } else {
                      fetchErrorDetails();
                    }
                  }}
                >
                  <Text style={styles.fixedText}>✓</Text>
                </TouchableOpacity>
              </View>
            )}
            {untested && (
              <View style={styles.untested}>
                <TouchableOpacity
                  hitSlop={8}
                  onPress={() => {
                    if (showTooltip) {
                      hideTooltip();
                    } else {
                      fetchErrorDetails();
                    }
                  }}
                >
                  <Text style={styles.untestedText}>?</Text>
                </TouchableOpacity>
              </View>
            )}{leaving && (
              <View style={styles.removal}>
                <TouchableOpacity
                  hitSlop={8}
                  onPress={() => {
                    if (showTooltip) {
                      hideTooltip();
                    } else {
                      fetchErrorDetails();
                    }
                  }}
                >
                  <Text style={styles.removalText}>🚧</Text>
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

          {!!issueId && (
            <Text
              style={styles.tooltipLink}
              onPress={() => {
                Linking.openURL(
                  `https://github.com/sparkly-games/sparkly/issues/${issueId}`
                );
              }}
            >
              Open in GitHub
            </Text>
          )}
        </Animated.View>
      )}
    </View>
  );
});

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
    backgroundColor: '#111',
    overflow: 'hidden',
  },

  image: {
    width: '100%',
    height: '100%',
  },

  textBox: {
    marginTop: 10,
    height: 20,
    justifyContent: 'center',
    width: '100%',
  },

  title: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },

  broken: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: 'rgba(239,68,68,0.92)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },

  brokenText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
  },

  untested: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: 'rgba(255, 225, 0, 0.96)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },

  fixed: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: 'rgba(0, 80, 177, 0.92)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },

  fixedText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
  },

  untestedText: {
    color: '#5f5f5f',
    fontSize: 22,
    fontWeight: '700',
  },

  removal: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    backgroundColor: 'rgba(0, 255, 106, 0.92)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },

  removalText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
  },

  tooltip: {
    position: 'absolute',
    right: 0,
    top: '105%',
    width: 190,
    backgroundColor: 'rgba(70,0,0,0.96)',
    borderRadius: 12,
    padding: 10,
    zIndex: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },

  tooltipText: {
    color: '#ffffff',
    fontSize: 11,
    lineHeight: 16,
  },

  tooltipLink: {
    color: '#ff6b6b',
    marginTop: 8,
    fontSize: 11,
    textAlign: 'left',
    fontWeight: '600',
  },

  lock: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(2,6,23,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  lockText: {
    fontSize: 32,
  },

  bannedOpacity: {
    opacity: 0.4,
  },
});