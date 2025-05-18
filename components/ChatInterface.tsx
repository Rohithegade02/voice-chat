import React from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';
import AudioRecorder from './AudioRecorder';
import ChatMessage from './ChatMessage';

// Interface Segregation Principle: Component takes only the props it needs
const ChatInterface = ({
  messages,
  loading,
  isProcessing,
  isRecording,
  hasPermission,
  onStartRecording,
  onStopRecording,
//   onPlayAudio,
}) => {
  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : (
        <FlatList
          style={styles.messageList}
          data={messages}
          keyExtractor={(item, index) => `message-${index}`}
          renderItem={({ item }) => (
            <ChatMessage 
            message={item} 
            // onPlay={onPlayAudio} 
            />
          )}
          inverted={false}
        />
      )}
      
      {isProcessing && (
        <View style={styles.processingContainer}>
          <ActivityIndicator size="small" color="#007AFF" />
        </View>
      )}
      
      <View style={styles.inputContainer}>
        <AudioRecorder
          isRecording={isRecording}
          hasPermission={hasPermission}
          onStartRecording={onStartRecording}
          onStopRecording={onStopRecording}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messageList: {
    flex: 1,
  },
  processingContainer: {
    padding: 10,
    alignItems: 'center',
  },
  inputContainer: {
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    padding: 10,
  },
});

export default ChatInterface;