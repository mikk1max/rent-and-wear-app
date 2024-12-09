import { ref as storageRef, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebase.config";

// Fetches the URL for an SVG file from Firebase Storage
export async function fetchSvgURL(filePath) {
  try {
    const svgRef = storageRef(storage, filePath);
    const url = await getDownloadURL(svgRef);
    return url;
  } catch (error) {
    console.error("Error fetching SVG:", error.message);
    throw new Error("Failed to fetch SVG file.");
  }
}

// Fetches the URL for an image file from Firebase Storage
export async function fetchImgURL(filePath) {
  try {
    const imgRef = storageRef(storage, filePath);
    const url = await getDownloadURL(imgRef);
    return url;
  } catch (error) {
    return getRandomAvatarUrl();
  }
}

// Fetches a random avatar image from Firebase Storage
export async function getRandomAvatarUrl() {
  try {
    const randomIndex = Math.floor(Math.random() * 4) + 1; // 1-4
    const avatarPath = `user-avatars/default/user-${randomIndex}.jpg`;
    const avatarRef = storageRef(storage, avatarPath);
    const url = await getDownloadURL(avatarRef);
    return url;
  } catch (error) {
    const avatarPath = `user-avatars/default/user-1.jpg`;
    const avatarRef = storageRef(storage, avatarPath);
    const url = await getDownloadURL(avatarRef);
    return url;
  }
}
