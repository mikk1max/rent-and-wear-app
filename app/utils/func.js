import { ref, get } from "firebase/database";
import { db } from "../../firebase.config";

export const getUserById = async (userIds) => {
  try {
    if (!Array.isArray(userIds)) {
      userIds = [userIds];
    }

    const userPromises = userIds.map(async (id) => {
      const userRef = ref(db, `users/${id}`);
      const snapshot = await get(userRef);

      if (snapshot.exists()) {
        return { [id]: snapshot.val() };
      } else {
        return { [id]: null };
      }
    });

    const usersArray = await Promise.all(userPromises);
    return Object.assign({}, ...usersArray);
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};

export const findUserById = async (userId) => {
  try {
    if (!userId) {
      console.error("User ID is required");
      return null;
    }

    const userRef = ref(db, `users/${userId}`);
    const snapshot = await get(userRef);

    if (snapshot.exists()) {
      return { id: userId, ...snapshot.val() };
    } else {
      console.log(`User with ID ${userId} not found`);
      return null;
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
};

export const cutTitle = (title) => {
  return title?.length > 20 ? title.slice(0, 16) + "..." : title
}

export const cutAdvertiserNameInDetails = (fullName) => {
  return fullName?.length > 16 ? fullName.slice(0, 15) + "..." : fullName
}