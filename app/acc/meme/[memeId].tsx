import { VideoView, useVideoPlayer } from 'expo-video';
import React, { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  View,
  StyleSheet
} from 'react-native';

const { height } = Dimensions.get('window');

const memes = [
  {
    id: 'areyou',
    video: require('@/assets/memes/areyou.mp4'),
  }
];

const MemeItem = ({
  item,
  active,
}: {
  item: (typeof memes)[0];
  active: boolean;
}) => {
  const player = useVideoPlayer(item.video, (player) => {
    player.loop = true;
  });

  useEffect(() => {
    if (active) {
      player.play();
    } else {
      player.pause();
      player.currentTime = 0;
    }
  }, [active]);

  return (
    <View style={styles.page}>
      <VideoView
        player={player}
        style={styles.video}
        nativeControls={true}
      />
    </View>
  );
};

const MemeFeed = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: any) => {
      if (viewableItems.length > 0) {
        setActiveIndex(viewableItems[0].index);
      }
    }
  ).current;

  return (
    <FlatList
      data={memes}
      keyExtractor={(item) => item.id}
      pagingEnabled
      showsVerticalScrollIndicator={false}
      snapToInterval={height}
      decelerationRate="fast"
      renderItem={({ item, index }) => (
        <MemeItem
          item={item}
          active={index === activeIndex}
        />
      )}
      onViewableItemsChanged={onViewableItemsChanged}
      viewabilityConfig={{
        itemVisiblePercentThreshold: 80,
      }}
    />
  );
};

export default MemeFeed;

const styles = StyleSheet.create({
  page: {
    height,
    backgroundColor: '#000',
  },
  video: {
    height: '100%'
  },
});