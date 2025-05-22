import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';

type AudioPlayerProps = {
  uri: string;
  onPlaybackPositionChange?: (position: number) => void;
  autoPlay?: boolean; // Add this prop if you want to control auto-play behavior
};

const AudioPlayer = ({
  uri,
  onPlaybackPositionChange,
  autoPlay = true,
}: AudioPlayerProps) => {
  const [playBackWidth, setPlayBackWidth] = useState(0);
  const player = useAudioPlayer({ uri });
  const status = useAudioPlayerStatus(player);

  const progress = status.currentTime / status.duration;

  useEffect(() => {
    onPlaybackPositionChange?.(status.currentTime);
  }, [status.currentTime]);

  // This effect handles play/pause based on status.playing
  useEffect(() => {
    if (status.playing) {
      player.play();
    } else {
      player.pause();
    }
  }, [status.playing]);

  useEffect(() => {
    if (autoPlay && uri) {
      // Directly call play() instead of setStatusAsync
      player.play();
    }
  }, [uri]);

  return (
    <View>
      {/* {status.playing ? (
        <Pressable
          onPress={() => {
            player.pause();
          }}
        >
          <FontAwesome name='pause' size={24} color='black' />
        </Pressable>
      ) : (
        <Pressable
          onPress={() => {
            player.play();
          }}
        >
          <FontAwesome name='play' size={24} color='black' />
        </Pressable>
      )}

      <Pressable
        onLayout={(e) => {
          setPlayBackWidth(e.nativeEvent.layout.width);
        }}
        onPress={(e) => {
          const x = e.nativeEvent.locationX;
          const newTime = (x / playBackWidth) * status.duration;
          player.seekTo(newTime);
        }}
        style={{
          height: 10,
          backgroundColor: 'grey',
          flex: 1,
          borderRadius: 10,
        }}
      >
        <View
          style={{
            height: 10,
            backgroundColor: 'blue',
            width: `${progress * 100}%`,
            borderRadius: 10,
          }}
        />
      </Pressable>

      <Pressable onPress={() => player.seekTo(0)}>
        <Text>Reset</Text>
      </Pressable> */}
    </View>
  );
};

export default AudioPlayer;
