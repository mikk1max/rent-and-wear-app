import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  RefreshControl,
} from "react-native";
import { ref, onValue, get } from "firebase/database";
import { db } from "../../firebase.config";
import { useUser } from "../components/UserProvider";
import { useNavigation } from "@react-navigation/native";
import { globalStyles, styles as mainStyles } from "../utils/style";
import { styles } from "../styles/AllChatsViewStyles";
import { getUserById } from "../utils/func";
import Icon from "../components/Icon";

const AllChatsView = () => {
  const { user } = useUser();
  const navigation = useNavigation();
  const [chats, setChats] = useState([]);
  const [filter, setFilter] = useState("All");
  const [refreshing, setRefreshing] = useState(false);
  const [userData, setUserData] = useState({});
  const [height, setHeight] = useState(0); // Height state for icon button
  const prevHeightRef = useRef(height); // Using useRef to keep track of previous height

  // Fetch chats from Firebase
  const fetchChats = useCallback(() => {
    return new Promise((resolve) => {
      if (!user?.id) return resolve(); // Resolve early if there's no user ID

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
            (filter === "All" ||
              (filter === "Rent Now" && isRentNow) ||
              (filter === "Rent Out" && isRentOut))
          ) {
            filteredChats.push({ id: key, ...chat });
          }
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
        const uniqueAdvertiserIds = [
          ...new Set(chats.map((chat) => chat.advertiserId)),
        ];
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
      {["All", "Rent Now", "Rent Out"].map((filterOption) => (
        <TouchableOpacity
          key={filterOption}
          onPress={() => setFilter(filterOption)}
          style={[
            styles.filterButton,
            filter === filterOption && styles.activeFilterButton,
          ]}
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

  // Render individual chat card
  const renderChat = (chat) => {
    if (!chat) return null;
    
    const firstMessage =
      (chat.messages &&
        Object.values(chat.messages)[Object.values(chat.messages).length - 1]
          ?.text) ||
      "";

    const advertiserName = userData.name || "Unknown";
    return (
      <TouchableOpacity
        key={chat.id}
        onPress={() => handleChatPress(chat.id)}
        style={styles.chatCard}
        activeOpacity={0.7}
        onLayout={handleLayout}
      >
        <View style={{ flexShrink: 1 }}>
          <Text style={styles.chatTitle}>Chat with {advertiserName}</Text>
          <Text style={styles.chatPreview}>{firstMessage}</Text>
        </View>
        <View>
          <TouchableOpacity
            style={{
              backgroundColor: globalStyles.primaryColor,
              padding: 10,
              borderRadius: globalStyles.BORDER_RADIUS,
              width: 50,
              height: height - 30,
              justifyContent: "center",
              alignItems: "center"
            }}
            onPress={() => navigation.navigate("AnnouncementView", {
              id: chat?.announcementId,
              title: fetchAnnouncementTitle(chat?.announcementId)
            })}
          >
            {/* {console.log(chat)} */}
            <Icon
              name="market"
              width={25}
              height={25}
              fillColor={globalStyles.textOnPrimaryColor}
            />
          </TouchableOpacity>
        </View>
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
