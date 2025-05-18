import { useStorageService } from '@/services/storage-service';
import { useEffect, useState } from 'react';

export const useChatHistory = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const storageService =  useStorageService('voice_chat_history');

  useEffect(() => {
    const loadMessages = async () => {
      setLoading(true);
      const savedMessages :any= await storageService.loadData();
      if (savedMessages) {
        setMessages(savedMessages);
      }
      setLoading(false);
    };
    
    loadMessages();
  }, []);

  const addMessage = async (message:string) => {
    const updatedMessages = [...messages, message];
    setMessages(updatedMessages);
    await storageService.saveData(updatedMessages);
    return updatedMessages;
  };

  const clearHistory = async () => {
    await storageService.clearData();
    setMessages([]);
  };

  return {
    messages,
    loading,
    addMessage,
    clearHistory
  };
};