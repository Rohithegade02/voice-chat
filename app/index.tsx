import { Buffer } from 'buffer';
import * as FileSystem from 'expo-file-system';
import React, { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

const SpeechToText = () => {
  const [text, setText] = useState('');

  const handleConvertToAudio = useCallback(async () => {
    // This function will handle the conversion of text to audio
    // You can use a library like react-native-tts for this purpose
    // For example:
    // Tts.speak(text);
    console.log('Converting to audio:', text);

    const response = await fetch('/api/tts', {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
    if (!response.ok) {
      console.error('Failed to convert text to audio');
      return;
    }

    console.log(response);

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
    console.log('Audio file saved to:', fileUri);
  }, [text]);

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>Speech to Text</Text>
      <TextInput
        value={text}
        onChangeText={setText}
        style={styles.input}
        placeholder='Press the button to start speaking'
        multiline
      />
      <Pressable style={styles.button} onPress={handleConvertToAudio}>
        <Text style={styles.buttonText}>Convert to Audio</Text>
      </Pressable>
      <Text>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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

export default SpeechToText;
