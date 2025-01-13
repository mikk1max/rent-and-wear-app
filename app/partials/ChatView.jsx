import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  SafeAreaView,
  Text,
  Alert,
  TouchableOpacity,
} from "react-native";
import { GiftedChat, Bubble, InputToolbar, Send } from "react-native-gifted-chat";
import { ref, onValue, push, set, remove } from "firebase/database";
import { db } from "../../firebase.config";
import { useRoute } from "@react-navigation/native";
import { useUser } from "../components/UserProvider";
import { globalStyles, styles as mainStyles } from "../utils/style";
import { fetchImgURL, getRandomAvatarUrl } from "../utils/fetchSVG";
import Icon from "../components/Icon";

export default function ChatView() {
  const { user, loading } = useUser();
  const route = useRoute();
  const { chatId } = route.params;

  const [messages, setMessages] = useState([]);
  const [userAvatars, setUserAvatars] = useState({});
  const [typingUsers, setTypingUsers] = useState([]);
  const [advertiserName, setAdvertiserName] = useState(null);

  if (loading) {
    return (
      <SafeAreaView style={mainStyles.whiteBack}>
        <View>
          <Text>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!user || !user.uid) {
    console.error("User is not authenticated:", user);
    Alert.alert("User is not authenticated. Please log in to access the chat.");
    return;
  }

  useEffect(() => {
    if (!chatId) {
      console.error("Chat ID is missing");
      Alert.alert("Something went wrong! Please try again later.");
      return;
    }

    const chatRef = ref(db, `chats/${chatId}`);
    const chatMessagesRef = ref(db, `chats/${chatId}/messages`);
    const typingRef = ref(db, `chats/${chatId}/typing`);

    // Fetch advertiser name
    const unsubscribeChat = onValue(chatRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setAdvertiserName(data.advertiserName || "Unknown");
      }
    });

    // Fetch messages
    const unsubscribeMessages = onValue(chatMessagesRef, async (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loadedMessages = await loadMessages(data);
        setMessages(loadedMessages.reverse());
      } else {
        setMessages([]);
      }
    });

    // Handle typing status
    const unsubscribeTyping = onValue(typingRef, (snapshot) => {
      const data = snapshot.val();
      const otherTypingUsers = data
        ? Object.keys(data).filter((uid) => uid !== user.uid)
        : [];
      setTypingUsers(otherTypingUsers);
    });

    return () => {
      unsubscribeChat();
      unsubscribeMessages();
      unsubscribeTyping();
    };
  }, [chatId, userAvatars]);

  const loadMessages = async (data) => {
    const loadedMessages = await Promise.all(
      Object.keys(data).map(async (key) => {
        const senderId = data[key].senderId;
        let avatar = userAvatars[senderId];

        if (!avatar) {
          avatar = await fetchUserAvatar(senderId);
        }

        return {
          _id: key,
          text: data[key].text,
          createdAt: new Date(data[key].timestamp),
          user: {
            _id: senderId,
            name:
              senderId === user.uid
                ? user.name || "You"
                : advertiserName || "Advertiser",
            avatar,
          },
        };
      })
    );
    return loadedMessages;
  };

  const fetchUserAvatar = async (senderId) => {
    try {
      const avatar = await fetchImgURL(
        `user-avatars/${senderId}/${senderId}.jpg`
      );
      setUserAvatars((prev) => ({ ...prev, [senderId]: avatar }));
      return avatar;
    } catch {
      const randomAvatar = await getRandomAvatarUrl();
      setUserAvatars((prev) => ({ ...prev, [senderId]: randomAvatar }));
      return randomAvatar;
    }
  };

  const handleTyping = (isTyping) => {
    const typingRef = ref(db, `chats/${chatId}/typing/${user.uid}`);
    if (isTyping) {
      set(typingRef, true);
    } else {
      remove(typingRef);
    }
  };

  const onSend = useCallback(
    (newMessages = []) => {
      if (!user?.uid) {
        console.error("User ID is undefined");
        return;
      }

      const chatRef = ref(db, `chats/${chatId}/messages`);
      newMessages.forEach((message) => {
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

      handleTyping(false);
    },
    [chatId, user?.uid]
  );

  return (
    <SafeAreaView style={[mainStyles.whiteBack]}>
      {/* <View style={[mainStyles.container, {alignItems: "stretch", paddingHorizontal: 10}]}> */}
      <GiftedChat
        messages={messages}
        onSend={(newMessages) => onSend(newMessages)}
        onInputTextChanged={(text) => handleTyping(!!text)}
        user={{
          _id: user.uid,
          name: user.name || "Anonymous",
          avatar: userAvatars[user.uid] || null,
        }}
        showAvatarForEveryMessage={true}
        renderAvatarOnTop={true}
        placeholder="Type a message..."
        scrollToBottom
        scrollToBottomComponent={() => (
          <View style={{ borderRadius: 20 }}>
            <Text style={{ color: "white", fontSize: 20 }}>↓</Text>
          </View>
        )}
        scrollToBottomStyle={{ backgroundColor: globalStyles.primaryColor }}
        renderBubble={(props) => (
          <Bubble
            {...props}
            wrapperStyle={{
              left: { backgroundColor: globalStyles.secondaryColor },
              right: { backgroundColor: globalStyles.textOnSecondaryColor },
            }}
            textStyle={{
              left: { color: globalStyles.accentColor },
              right: { color: globalStyles.textOnAccentColor },
            }}
          />
        )}
        isTyping={typingUsers.length > 0}
        maxInputLength={1000}
        alwaysShowSend
        renderSend={(props) => (
          <Send {...props}>
              <Icon
                name="send"
                width={40}
                height={40}
                fillColor={globalStyles.accentColor}
                colorStroke="white"
              />
          </Send>
        )}
        renderInputToolbar={(props) => (
          <InputToolbar
            {...props}
            containerStyle={{
              paddingHorizontal: 10,
              paddingVertical: 5,
            }}
          />
        )}
      />
      {/* </View> */}
    </SafeAreaView>
  );
}
