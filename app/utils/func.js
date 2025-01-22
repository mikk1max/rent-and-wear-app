import { ref, get } from "firebase/database";
import { db } from "../../firebase.config";

export const getUserById = async (userIds) => {
  try {
    // Ensure userIds is an array
    if (!Array.isArray(userIds)) {
      userIds = [userIds];
    }

    const userPromises = userIds.map(async (id) => {
      const userRef = ref(db, `users/${id}`);
      const snapshot = await get(userRef);

      if (snapshot.exists()) {
        return { [id]: snapshot.val() };
      } else {
        // console.log(`No user found with ID: ${id}`);
        return { [id]: null };
      }
    });

    // Combine results into a single object
    const usersArray = await Promise.all(userPromises);
    return Object.assign({}, ...usersArray);
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};

export const cutTitle = (title) => {
  return title?.length > 20 ? title.slice(0, 16) + "..." : title
}