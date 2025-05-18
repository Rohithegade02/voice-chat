import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import ChatInterface from '../components/ChatInterface';
import { useAudioRecording } from '../hooks/useAudioRecording';
import { useChatHistory } from '../hooks/useChatHistory';
import { createOpenAIAIService } from '../services/ai-services';

const ChatScreen = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { 
    isRecording, 
    hasPermission, 
    startRecording, 
    stopRecording, 
    // playRecording 
  } = useAudioRecording();
  
  const { messages, addMessage } = useChatHistory();
  
  // Create AI service with dependency injection
  const aiService = createOpenAIAIService('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' )

  const handleStartRecording = useCallback(async () => {
    await startRecording();
  }, [startRecording]);

  const handleStopRecording = useCallback(async () => {
    setIsProcessing(true);
    
    try {
      // Stop recording and get audio URI
      const audioUri = await stopRecording();
      if (!audioUri) {
        throw new Error('Failed to get recording');
      }
      
      // Add user message to chat
      await addMessage({
        sender: 'user',
        text: 'Voice message sent',
        audioUri,
        timestamp: new Date().toISOString()
      });
      
      // Process with AI
      const aiResponse = await aiService.sendAudioAndGetResponse(audioUri);
      
      // Add AI response to chat
      await addMessage({
        sender: 'ai',
        text: aiResponse.text,
        timestamp: aiResponse.timestamp
      });
    } catch (error) {
      console.error('Error processing recording:', error);
      Alert.alert('Error', 'Failed to process your message');
    } finally {
      setIsProcessing(false);
    }
  }, [stopRecording, addMessage, aiService]);

  // const handlePlayAudio = useCallback(async (uri) => {
  //   await playRecording(uri);
  // }, [playRecording]);

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <ChatInterface
        messages={messages}
        loading={false}
        isProcessing={isProcessing}
        isRecording={isRecording}
        hasPermission={hasPermission}
        onStartRecording={handleStartRecording}
        onStopRecording={handleStopRecording}
        // onPlayAudio={handlePlayAudio}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 40,
  },
});

export default ChatScreen;
