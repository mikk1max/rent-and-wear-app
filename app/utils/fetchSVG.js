import { ref as storageRef, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebaseConfig";

export default async function fetchSvgURL(filePath) {
  const svgRef = storageRef(storage, filePath);
  const url = await getDownloadURL(svgRef);
  return url;
}

export async function fetchImgURL(filePath) {
  const imgRef = storageRef(storage, filePath);
  const url = await getDownloadURL(imgRef);
  return url;
}
