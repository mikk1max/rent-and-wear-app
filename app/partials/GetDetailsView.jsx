import React, { useState, useEffect } from "react";
import {
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
  StyleSheet,
} from "react-native";
import { useCustomFonts } from "../utils/fonts";
import { useNavigation } from "@react-navigation/native";
import { Divider } from "react-native-elements";

import { ref as sRef, onValue, get } from "firebase/database";
import { db } from "../../firebase.config";
import { useUser } from "../components/UserProvider";

import Loader from "../components/Loader";

const GetDetailsView = ({ route }) => {
  const navigation = useNavigation();

  const { user, setUser } = useUser();

  const { id } = route.params;

  const [currentRentOrReservation, setCurrentRentOrReservation] =
    useState(null);
  const [currentAnnouncement, setCurrentAnnouncement] = useState(null);
  const [currentAdvertiser, setCurrentAdvertiser] = useState(null);

  const fontsLoaded = useCustomFonts();
  if (!fontsLoaded) return null;

  if (!db) {
    console.error("Firebase database is not initialized.");
    return;
  }

  // Pobieranie bieżącego użytkownika
  // useEffect(() => {
  //   if (!user) return;

  //   const usersRef = sRef(db, "users");
  //   const unsubscribe = onValue(usersRef, (snapshot) => {
  //     const data = snapshot.val();
  //     if (data) {
  //       const currentUserEntry = Object.entries(data).find(
  //         ([key, userData]) => userData.email === user.email
  //       );

  //       if (currentUserEntry) {
  //         const [key, userData] = currentUserEntry;
  //         setUser({ ...userData, id: key }); // Dodaj klucz jako "id"
  //       } else {
  //         setUser(null);
  //       }
  //     } else {
  //       setUser(null);
  //     }
  //   });

  //   return () => unsubscribe();
  // }, [user]);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const announcementsRef = sRef(db, "announcements");
        const usersRef = sRef(db, "users");

        const announcementsSnapshot = await get(announcementsRef);
        if (!announcementsSnapshot.exists()) {
          console.log("Announcements not found");
          return;
        }

        const announcements = announcementsSnapshot.val();
        let foundRentOrReservation = null;
        let foundAnnouncement = null;

        for (const announcementId in announcements) {
          const announcement = announcements[announcementId];
          const rentalData = announcement.rentalData || {};
          const reservationData = announcement.reservationData || {};

          if (rentalData[id]) {
            foundRentOrReservation = { ...rentalData[id], id };
            foundAnnouncement = announcement;
            break;
          }
          if (reservationData[id]) {
            foundRentOrReservation = { ...reservationData[id], id };
            foundAnnouncement = announcement;
            break;
          }
        }

        if (!foundRentOrReservation || !foundAnnouncement) {
          console.log("No matching rental or reservation found");
          return;
        }

        setCurrentRentOrReservation(foundRentOrReservation);
        setCurrentAnnouncement({
          ...foundAnnouncement,
          image: foundAnnouncement.images?.[0] || null,
        });

        if (foundAnnouncement.advertiserId) {
          const advertiserSnapshot = await get(
            sRef(usersRef, foundAnnouncement.advertiserId)
          );
          if (advertiserSnapshot.exists()) {
            setCurrentAdvertiser({
              ...advertiserSnapshot.val(),
              id: foundAnnouncement.advertiserId,
            });
          } else {
            console.log(
              `Advertiser with ID ${foundAnnouncement.advertiserId} not found`
            );
          }
        } else {
          console.log("No advertiser ID found in announcement");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (id) {
      fetchDetails();
    }
  }, [id]);

  // console.log(currentRentOrReservation);
  // console.log(currentAnnouncement);
  // console.log(currentAdvertiser);

  if (!currentRentOrReservation || !currentAnnouncement || !currentAdvertiser) {
    return <Loader />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Image
          source={{ uri: currentAnnouncement.image }}
          style={styles.image}
        />
        <Text style={styles.title}>{currentAnnouncement.title}</Text>
        <Divider style={styles.divider} />
        <Text>Category: {currentAnnouncement.category.subcategoryName}</Text>
        <Text>Condition: {currentAnnouncement.condition}</Text>
        <Text>Size: {currentAnnouncement.size}</Text>
        <Text>Price per day: ${currentAnnouncement.pricePerDay}</Text>
        <Divider style={styles.divider} />
        <Text>Rented by: {currentRentOrReservation.borrowerId}</Text>
        <Text>Days in Rent: {currentRentOrReservation.daysInRent}</Text>
        <Text>Status: {currentRentOrReservation.status.statusName}</Text>
        <Divider style={styles.divider} />
        {currentAdvertiser ? (
          <>
            <Text>Advertiser: {currentAdvertiser.name}</Text>
            <Text>Email: {currentAdvertiser.email}</Text>
          </>
        ) : (
          <Text>Advertiser data not available.</Text>
        )}

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default GetDetailsView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    height: 200,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  divider: {
    marginVertical: 8,
  },
  backButton: {
    marginTop: 16,
    padding: 12,
    backgroundColor: "#007BFF",
    borderRadius: 8,
    alignItems: "center",
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
