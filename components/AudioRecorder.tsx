// app/components/AudioRecorder.js
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Single Responsibility Principle: Only responsible for audio recording UI
const AudioRecorder = ({ 
  isRecording, 
  hasPermission, 
  onStartRecording, 
  onStopRecording 
}) => {
  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>
          Microphone permission not granted
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.recordButton,
          isRecording ? styles.recordingActive : null
        ]}
        onPress={isRecording ? onStopRecording : onStartRecording}
      >
        <Ionicons
          name={isRecording ? "stop" : "mic"}
          size={28}
          color="white"
        />
      </TouchableOpacity>
      <Text style={styles.recordingText}>
        {isRecording ? 'Recording...' : 'Tap to speak'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 15,
  },
  recordButton: {
    backgroundColor: '#007AFF',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordingActive: {
    backgroundColor: '#FF3B30',
  },
  recordingText: {
    marginTop: 5,
    color: '#555',
  },
  permissionText: {
    color: 'red',
    marginBottom: 10,
  },
});

export default AudioRecorder;