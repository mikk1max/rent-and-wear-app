import { ref, get } from "firebase/database";
import { db } from "../../firebase.config";

export const getUserById = async (userId) => {
  try {
    // Reference the users node in your Firebase Realtime Database
    const userRef = ref(db, `users/${userId}`);
    const snapshot = await get(userRef);
    
    if (snapshot.exists()) {
      const userData = snapshot.val();
      console.log("User found:", userData);
      return userData;
      
    } else {
      console.log("No user found with the given ID.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user:", error);
  }
};
