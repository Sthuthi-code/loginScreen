import React, { useContext, useEffect, useState } from 'react';
import { View, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { addMessage, getMessages } from '../services/apiRequest';
import Loading from '../components/Loading';
import { Text, useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AuthContext } from '../store/auth-context';

type Message = {
  id: number;
  text: string;
  sender: '';
  receiver: '';
};

const ChatScreen: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const colorTheme = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = route.params;
  const { email } = useContext(AuthContext);

  const getAllMessages = async()=>{
    const response = await getMessages();
    const filteredMessages = response.filter(
      (message) => (
        (message.sender === user.email && message.receiver === email) ||
        (message.sender === email && message.receiver === user.email)
      )
    );
    setMessages(filteredMessages);
    setLoading(false);
  };

  useEffect(()=>{
    getAllMessages();
  },[]);

  const [expandedMessages, setExpandedMessages] = useState<{ [key: number]: boolean }>({});
  const [inputText, setInputText] = useState('');

  const toggleExpand = (id: number) => {
    setExpandedMessages((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: messages.length + 1,
      text: inputText,
      sender: email,
      receiver: user.email,
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInputText('');

    try {
      const response = await addMessage({
        text: inputText,
        sender: email,
        receiver: user.email,
      });
      console.log(response);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isExpanded = expandedMessages[item.id];
    const shouldTruncate = item.text.length > 100;
    const displayedText = shouldTruncate && !isExpanded ? `${item.text.slice(0, 100)}...` : item.text;

    return (
      <View
        style={[
          styles.messageContainer,
          item.sender === email ? styles.userMessage : styles.botMessage,
        ]}
      >
        <Text style={item.sender === email ? styles.userText : styles.botText}>{displayedText}</Text>
        {shouldTruncate && (
          <TouchableOpacity onPress={() => toggleExpand(item.id)}>
            <Text style={styles.moreText}>{isExpanded ? 'Read Less' : 'Read More'}</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    loading ?
      <Loading/> :
    <View style={{ backgroundColor: colorTheme.background, flex: 1, padding: 20 }}>
    {messages.length === 0 ? (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No messages yet</Text>
      </View>
    ) : (
      <FlatList data={messages} keyExtractor={(item) => item.id.toString()} renderItem={renderMessage} />)}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholderTextColor="#999"
          placeholder={t('type')}
          value={inputText}
          onChangeText={setInputText}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>{t('send')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  messageContainer: {
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    maxWidth: '80%',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  userMessage: {
    backgroundColor: '#1a1a1a',
    alignSelf: 'flex-end',
  },
  botMessage: {
    margin: 0.5,
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
  },
  userText: {
    color: '#fff',
  },
  botText: {
    color: '#000',
  },
  moreText: {
    color: '#282f36',
    marginTop: 5,
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  input: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderRadius: 20,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    color: 'black',
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#888',
  },
});

export default ChatScreen;
