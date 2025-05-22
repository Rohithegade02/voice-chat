import CustomButton from '@/components/CustomButton';
import { Buffer } from 'buffer';
import * as FileSystem from 'expo-file-system';
import React, { useCallback, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

const TextToSpeech = ({ text }: { text: string }) => {
  console.log('TextToSpeech', text);
  const [audioUri, setAudioUri] = useState<string | null>(null);

  // Function to handle text input changes
  const handleConvertToAudio = useCallback(async () => {
    const response = await fetch('/api/tts', {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
    if (!response.ok) {
      console.error('Failed to convert text to audio');
      return;
    }

    try {
      const arrayBuffer = await response.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);

      const fileUri = FileSystem.documentDirectory! + Date.now() + '.mp3';

      await FileSystem.writeAsStringAsync(
        fileUri,
        Buffer.from(uint8Array).toString('base64'),
        {
          encoding: FileSystem.EncodingType.Base64,
        },
      );
      setAudioUri(fileUri);
    } catch (error) {
      console.error('Error saving audio file:', error);
    }
  }, [text]);

  return (
    <View style={styles.container}>
      {/* <TextInput
        value={text}
        onChangeText={setText}
        style={styles.input}
        placeholder='Press the button to start speaking'
        multiline
      /> */}
      <CustomButton title='Convert to Audio' onPress={handleConvertToAudio} />
      {text && <Text>{text}</Text>}
      {/* {audioUri && <AudioPlayer uri={audioUri} onPlay={() => {}} />} */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 10,
    gap: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gainsboro',
    padding: 10,
    borderRadius: 10,
    minHeight: 150,
  },
  button: {
    backgroundColor: 'royalblue',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    fontWeight: 'bold',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default TextToSpeech;
