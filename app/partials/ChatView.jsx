import React, { useState, useEffect, useCallback } from "react";
import { View, SafeAreaView, Text } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import { ref, onValue, push } from "firebase/database";
import { db } from "../../firebase.config";
import { useRoute } from "@react-navigation/native";
import { useUser } from "../components/UserProvider";
import { styles as mainStyles } from "../utils/style";

export default function ChatView() {
  const { user, loading } = useUser();
  const route = useRoute();
  const { chatId } = route.params;

  const [messages, setMessages] = useState([]);

  // Show a loading state while the user is being initialized
  if (loading) {
    return (
      <SafeAreaView>
        <View>
          <Text>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Check if the user is authenticated and has the necessary properties
  if (!user || !user.uid || !user.name) {
    console.error("User is not authenticated or missing required properties:", user);
    return (
      <SafeAreaView>
        <View>
          <Text>User is not authenticated. Please log in to access the chat.</Text>
        </View>
      </SafeAreaView>
    );
  }

  useEffect(() => {
    const chatRef = ref(db, `chats/${chatId}/messages`);
    const unsubscribe = onValue(chatRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loadedMessages = Object.keys(data)
          .map((key) => ({
            _id: key,
            text: data[key].text,
            createdAt: new Date(data[key].timestamp),
            user: {
              _id: data[key].senderId,
            },
          }))
          .reverse();
        setMessages(loadedMessages);
      }
    });

    return () => unsubscribe();
  }, [chatId]);

  const onSend = useCallback(
    (newMessages = []) => {
      if (!user?.uid) {
        console.error("User ID is undefined");
        return;
      }

      const chatRef = ref(db, `chats/${chatId}/messages`);
      newMessages.forEach((message) => {
        if (!message.text) {
          console.error("Message text is undefined or empty:", message);
          return;
        }

        push(chatRef, {
          text: message.text,
          senderId: user.uid,
          timestamp: Date.now(),
        }).catch((error) =>
          console.error("Failed to push message to Firebase:", error)
        );
      });

      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, newMessages)
      );
    },
    [chatId, user?.uid]
  );

  return (
    <SafeAreaView>
      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: user.uid,
          name: user.name || "Unknown", // Provide a fallback name
        }}
      />
    </SafeAreaView>
  );
}
