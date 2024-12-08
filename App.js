import React, { useEffect } from "react";
import { View, Platform, StatusBar, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import NavigationStack from "./app/components/NavigationStack";
import { styles } from "./app/utils/style";
import { UserProvider, useUser } from "./app/components/UserProvider";

const AppContent = () => {
  const { user, loading } = useUser(); // Hook do sprawdzania użytkownika

  // if (loading) {
  //   return (
  //     <View
  //       style={[
  //         styles.whiteBack,
  //         { flex: 1, justifyContent: "center", alignItems: "center" },
  //       ]}
  //     >
  //       <Text>Loading...</Text>
  //     </View>
  //   );
  // }

  // if (!user) {
  //   return (
  //     <View
  //       style={[
  //         styles.whiteBack,
  //         { flex: 1, justifyContent: "center", alignItems: "center" },
  //       ]}
  //     >
  //       <Text>Please log in</Text>
  //     </View>
  //   );
  // }

  return (
    <NavigationContainer>
      <NavigationStack />
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <View style={[styles.whiteBack, { flex: 1 }]}>
      <StatusBar
        barStyle={Platform.OS === "ios" ? "dark-content" : "light-content"}
        backgroundColor="#FFFFFF"
      />
      <UserProvider>
        <AppContent />
      </UserProvider>
    </View>
  );
}
