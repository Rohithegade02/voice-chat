import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Single Responsibility Principle: Only responsible for displaying a message
const ChatMessage = ({ message }) => {
  const isUser = message.sender === 'user';
  
  return (
    <View style={[
      styles.messageContainer,
      isUser ? styles.userMessage : styles.aiMessage
    ]}>
      {isUser && message.audioUri && (
        <TouchableOpacity 
          style={styles.playButton}
        //   onPress={() => onPlay(message.audioUri)}
        >
          <Ionicons name="play-circle" size={24} color="#333" />
        </TouchableOpacity>
      )}
      
      <View style={styles.messageContent}>
        <Text style={styles.senderText}>
          {isUser ? 'You' : 'AI Assistant'}
        </Text>
        <Text style={styles.messageText}>{message.text}</Text>
        <Text style={styles.timestampText}>
          {new Date(message.timestamp).toLocaleTimeString()}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    marginVertical: 5,
    marginHorizontal: 10,
    padding: 10,
    borderRadius: 12,
    maxWidth: '80%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
  },
  aiMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#ECECEC',
  },
  messageContent: {
    flex: 1,
  },
  senderText: {
    fontWeight: 'bold',
    marginBottom: 4,
    fontSize: 12,
  },
  messageText: {
    fontSize: 16,
  },
  timestampText: {
    fontSize: 10,
    color: '#888',
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  playButton: {
    marginRight: 8,
  },
});

export default ChatMessage;