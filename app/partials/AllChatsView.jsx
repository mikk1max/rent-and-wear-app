import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  RefreshControl,
} from "react-native";
import { ref, onValue } from "firebase/database";
import { db } from "../../firebase.config";
import { useUser } from "../components/UserProvider";
import { useNavigation } from "@react-navigation/native";
import { styles as mainStyles } from "../utils/style";
import { styles } from "../styles/AllChatsViewStyles";
import { getUserById } from "../utils/func";

const AllChatsView = () => {
  const { user } = useUser();
  const navigation = useNavigation();
  const [chats, setChats] = useState([]);
  const [filter, setFilter] = useState("All");
  const [refreshing, setRefreshing] = useState(false);
  const [userData, setUserData] = useState({});

  const fetchChats = useCallback(() => {
    if (!user?.uid) return;

    const chatsRef = ref(db, "chats");
    const unsubscribe = onValue(chatsRef, (snapshot) => {
      const data = snapshot.val() || {};
      const filteredChats = [];

      Object.keys(data).forEach((key) => {
        const chat = data[key];

        const isRentNow = chat?.userId === user.uid;
        const isRentOut = chat?.advertiserId === user.uid;

        if (
          (isRentNow || isRentOut) &&
          (filter === "All" ||
            (filter === "Rent Now" && isRentNow) ||
            (filter === "Rent Out" && isRentOut))
        ) {
          filteredChats.push({ id: key, ...chat });
        }
      });

      setChats(filteredChats);
      setRefreshing(false);
    });

    return () => unsubscribe();
  }, [user, filter]);

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user?.uid && chats.length > 0) {
        const uniqueAdvertiserIds = [...new Set(chats.map((chat) => chat.advertiserId))];
        const userInfo = await getUserById(uniqueAdvertiserIds);
        setUserData(userInfo);
      }
    };
  
    fetchUserData();
  }, [user, chats]);
  

  const handleChatPress = (chatId) => {
    console.log("Navigating to Chat with ID:", chatId);
    navigation.navigate("Chat", { chatId });
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchChats();
  };

  const renderFilterButtons = () => (
    <View style={styles.filterButtonsContainer}>
      {["All", "Rent Now", "Rent Out"].map((filterOption) => (
        <TouchableOpacity
          key={filterOption}
          onPress={() => setFilter(filterOption)}
          style={[
            styles.filterButton,
            filter === filterOption && styles.activeFilterButton,
          ]}
        >
          <Text style={styles.filterButtonText}>{filterOption}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderChat = (chat) => {
    const firstMessage = chat.messages
      ? Object.values(chat.messages)[Object.values(chat.messages).length - 1]?.text || ""
      : "";

    const advertiserName = userData.name + " " + userData.surname || "Unknown";
    return (
      <TouchableOpacity
        key={chat.id}
        onPress={() => handleChatPress(chat.id)}
        style={styles.chatCard}
        activeOpacity={0.7}
      >
        <Text style={styles.chatTitle}>
          {advertiserName}
        </Text>
        <Text style={styles.chatPreview}>{firstMessage}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={mainStyles.whiteBack}>
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
            <Text style={styles.noChatsText}>No chats available</Text>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default AllChatsView;
