import { FontAwesome } from '@expo/vector-icons';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

type AudioPlayerProps = {
  uri: string;
  onPlay?: (uri: string) => void;
};

const AudioPlayer = ({ uri }: AudioPlayerProps) => {
  const [playBackWidth, setPlayBackWidth] = useState(0);
  const player = useAudioPlayer({ uri });
  const status = useAudioPlayerStatus(player);

  const progress = (status.currentTime / status.duration) * 100;

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        padding: 10,
      }}
    >
      {status.playing ? (
        <FontAwesome
          name='pause'
          size={24}
          color='royalblue'
          onPress={() => {
            player.pause();
          }}
        />
      ) : (
        <FontAwesome
          name='play'
          size={24}
          color='royalblue'
          onPress={() => {
            player.play();
          }}
        />
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
            backgroundColor: 'royalblue',
            width: `${progress}%`,
            borderRadius: 10,
          }}
        />
        <View
          style={{
            width: 15,
            height: 15,
            backgroundColor: '#fff',
            borderRadius: 15,
            position: 'absolute',
            transform: [{ translateX: -7.5 }, { translateY: -2.5 }],
            left: `${progress}%`,
          }}
        />
      </Pressable>
      <Text onPress={() => player.seekTo(0)}>Reset</Text>
    </View>
  );
};

export default AudioPlayer;
