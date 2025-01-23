import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  SafeAreaView,
  Text,
  Alert,
  TouchableOpacity,
} from "react-native";
import {
  GiftedChat,
  Bubble,
  InputToolbar,
  Send,
} from "react-native-gifted-chat";
import { ref, onValue, push, set, remove } from "firebase/database";
import { db } from "../../firebase.config";
import { useRoute } from "@react-navigation/native";
import { useUser } from "../components/UserProvider";
import { globalStyles, styles as mainStyles } from "../utils/style";
import { fetchImgURL, getRandomAvatarUrl } from "../utils/fetchSVG";
import Icon from "../components/Icon";
import Loader from "../components/Loader";
import { useTranslation } from "react-i18next";

export default function ChatView() {
  const { user, loading } = useUser();
  const route = useRoute();
  const { chatId } = route.params;
  const { t, i18n } = useTranslation();

  const [messages, setMessages] = useState([]);
  const [userAvatars, setUserAvatars] = useState({});
  const [typingUsers, setTypingUsers] = useState([]);
  const [advertiserName, setAdvertiserName] = useState(null);

  if (loading) {
    return (
      <SafeAreaView style={mainStyles.whiteBack}>
        <Loader />
      </SafeAreaView>
    );
  }

  if (!user || !user.id) {
    console.error("User is not authenticated:", user);
    Alert.alert(t("chat.userNotAuth"));
    return;
  }

  useEffect(() => {
    if (!chatId) {
      console.error("Chat ID is missing");
      Alert.alert(t("universal.somethingWentWrong"));
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
        ? Object.keys(data).filter((id) => id !== user.id)
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

        // Ensure timestamp is valid and in milliseconds
        const timestamp = data[key].timestamp
          ? new Date(Number(data[key].timestamp))
          : null;

        console.log("Timestamp:", data[key].timestamp);

        return {
          _id: key,
          text: data[key].text,
          createdAt: timestamp || new Date(), // Pass the raw Date object here
          user: {
            _id: senderId,
            name:
              senderId === user.id
                ? user.name || (i18n.language === "en" ? "You" : "Ty")
                : advertiserName ||
                  (i18n.language === "en" ? "Advertiser" : "Ogłoszeniodawca"),
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
    const typingRef = ref(db, `chats/${chatId}/typing/${user.id}`);
    if (isTyping) {
      set(typingRef, true);
    } else {
      remove(typingRef);
    }
  };

  const onSend = useCallback(
    (newMessages = []) => {
      if (!user?.id) {
        console.error("User ID is undefined");
        return;
      }

      if (!user.id && newMessages.length > 0) {
        const firstMessage = newMessages[0];
        user.id = firstMessage.user._id;
      }

      const chatRef = ref(db, `chats/${chatId}/messages`);
      newMessages.forEach((message) => {
        push(chatRef, {
          text: message.text,
          senderId: user.id,
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
    [chatId, user?.id]
  );

  return (
    <SafeAreaView style={[mainStyles.whiteBack]}>
      {/* <View style={[mainStyles.container, {alignItems: "stretch", paddingHorizontal: 10}]}> */}
      <GiftedChat
        messages={messages}
        locale={`${i18n.language}`}
        onSend={(newMessages) => onSend(newMessages)}
        onInputTextChanged={(text) => handleTyping(!!text)}
        user={{
          _id: user.id,
          name: user.name || "Anonymous",
          avatar: userAvatars[user.id] || null,
        }}
        showAvatarForEveryMessage={true}
        renderAvatarOnTop={true}
        placeholder={t("chat.inputPlaceholder")}
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
              left: { color: globalStyles.primaryColor },
              right: { color: globalStyles.textOnPrimaryColor },
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
              fillColor={globalStyles.primaryColor}
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
