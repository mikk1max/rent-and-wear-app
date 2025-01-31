import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  RefreshControl,
  StatusBar,
} from "react-native";
import { ref, onValue, get } from "firebase/database";
import { db } from "../../firebase.config";
import { useUser } from "../components/UserProvider";
import { useNavigation } from "@react-navigation/native";
import { globalStyles, styles as mainStyles } from "../utils/style";
import { styles } from "../styles/AllChatsViewStyles";
import { getUserById } from "../utils/func";
import Icon from "../components/Icon";
import NoConversation from "../components/NoConversation";
import { useTranslation } from "react-i18next";

const AllChatsView = () => {
  const { user } = useUser();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [chats, setChats] = useState([]);
  const [filter, setFilter] = useState(`${t("chat.allBtn")}`);
  const [refreshing, setRefreshing] = useState(false);
  const [userData, setUserData] = useState({});
  const [height, setHeight] = useState(0); // Height state for icon button
  const prevHeightRef = useRef(height); // Using useRef to keep track of previous height

  const fetchChats = useCallback(() => {
    return new Promise((resolve) => {
      if (!user?.id) return resolve();

      const chatsRef = ref(db, "chats");
      const unsubscribe = onValue(chatsRef, (snapshot) => {
        const data = snapshot.val() || {};
        const filteredChats = [];

        Object.keys(data).forEach((key) => {
          const chat = data[key];

          if (!chat) return;

          const isRentNow = chat?.userId === user.id;
          const isRentOut = chat?.advertiserId === user.id;

          if (
            (isRentNow || isRentOut) &&
            (filter === `${t("chat.allBtn")}` ||
              (filter === `${t("chat.rentNowBtn")}` && isRentNow) ||
              (filter === `${t("chat.rentOutBtn")}` && isRentOut))
          ) {
            filteredChats.push({ id: key, ...chat });
          }
        });

        filteredChats.sort((a, b) => {
          const lastMessageA =
            a.messages &&
            Object.values(a.messages)[Object.values(a.messages).length - 1];
          const lastMessageB =
            b.messages &&
            Object.values(b.messages)[Object.values(b.messages).length - 1];

          if (lastMessageA && lastMessageB) {
            return lastMessageB.timestamp - lastMessageA.timestamp;
          }
          return 0;
        });

        setChats(filteredChats);
        setRefreshing(false);
        resolve(); // Resolve the promise after fetching data
      });

      return () => unsubscribe();
    });
  }, [user, filter]);

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user?.id && chats.length > 0) {
        // Identify other participant IDs
        const otherParticipantIds = [
          ...new Set(
            chats.map((chat) =>
              chat.userId === user.id ? chat.advertiserId : chat.userId
            )
          ),
        ];

        const userInfo = await getUserById(otherParticipantIds);
        setUserData(userInfo); // Store fetched user data
      }
    };

    fetchUserData();
  }, [user, chats]);

  const handleChatPress = (chatId) => {
    console.log("Navigating to Chat with ID:", chatId);
    navigation.navigate("Chat", { chatId });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchChats();
    setRefreshing(false);
  };

  const fetchAnnouncementTitle = async (announcementId) => {
    const announcementRef = ref(db, "announcements/" + announcementId);
    const snapshot = await get(announcementRef);
    if (snapshot.exists()) {
      return snapshot.val().title; // Assuming the "title" is a field in the announcement
    }
    return "No Title";
  };

  // Render filter buttons
  const renderFilterButtons = () => (
    <View style={styles.filterButtonsContainer}>
      {[
        `${t("chat.allBtn")}`,
        `${t("chat.rentNowBtn")}`,
        `${t("chat.rentOutBtn")}`,
      ].map((filterOption) => (
        <TouchableOpacity
          key={filterOption}
          onPress={() => setFilter(filterOption)}
          style={[
            styles.filterButton,
            filter === filterOption && styles.activeFilterButton,
          ]}
          activeOpacity={globalStyles.ACTIVE_OPACITY}
        >
          <Text
            style={
              filter !== filterOption
                ? styles.filterButtonText
                : styles.activeFilterButtonText
            }
          >
            {filterOption}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const handleLayout = useCallback((event) => {
    const { height: newHeight } = event.nativeEvent.layout;

    // Only update height if it's different from the previous height
    if (newHeight !== prevHeightRef.current) {
      prevHeightRef.current = newHeight; // Update ref with the new height value
      setHeight(newHeight); // Set state only when height is different
    }
  }, []);

  const handleAnnouncementPress = async (chat) => {
    const title = await fetchAnnouncementTitle(chat?.announcementId);
    navigation.navigate("AnnouncementView", {
      id: chat?.announcementId,
      title: title,
    });
  };

  // Render individual chat card
  const renderChat = (chat) => {
    if (!chat) return null;

    const firstMessage =
      (chat.messages &&
        Object.values(chat.messages)[Object.values(chat.messages).length - 1]
          ?.text) ||
      "";

    // Determine the other participant
    const otherParticipantId =
      chat.userId === user.id ? chat.advertiserId : chat.userId;
    const otherParticipantName =
      userData?.[otherParticipantId]?.name || t("chat.noUserName");

    return (
      <View style={{flexDirection: "row"}} key={chat.id}>
        <TouchableOpacity
          onPress={() => handleChatPress(chat.id)}
          style={styles.chatCard}
          activeOpacity={globalStyles.ACTIVE_OPACITY}
          onLayout={handleLayout}
        >
          <View style={{ flexShrink: 1 }}>
            <Text style={styles.chatTitle}>
              Chat with {otherParticipantName}
            </Text>
            <Text style={styles.chatPreview} numberOfLines={1}>{firstMessage}</Text>
          </View>
        </TouchableOpacity>
        <View>
          <TouchableOpacity
            style={{
              backgroundColor: globalStyles.primaryColor,
              padding: 10,
              borderTopRightRadius: globalStyles.BORDER_RADIUS,
              borderBottomRightRadius: globalStyles.BORDER_RADIUS,
              width: 60,
              height: height,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => handleAnnouncementPress(chat)}
            activeOpacity={globalStyles.ACTIVE_OPACITY}
          >
            <Icon
              name="market"
              width={25}
              height={25}
              fillColor={globalStyles.textOnPrimaryColor}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={mainStyles.whiteBack}>
      <StatusBar backgroundColor={globalStyles.primaryColor} barStyle="light-content" />
      <View style={[mainStyles.container]}>
        {renderFilterButtons()}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            mainStyles.scrollBase,
            { alignItems: "stretch" },
          ]}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {chats.length > 0 ? (
            chats.map((chat) => renderChat(chat))
          ) : (
            <NoConversation />
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default AllChatsView;
