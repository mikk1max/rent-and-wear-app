import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { ref, set } from "firebase/database";
import { getAuth, signOut } from "firebase/auth";
import { db } from "../../firebase.config";

export const onRegister = async (data, initializeUser) => {
  try {
    const auth = getAuth();
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );

    const userRef = ref(db, `users/${userCredential.user.uid}`);
    await set(userRef, {
      email: data.email,
      id: userCredential.user.uid,
      name: "Unknown",
      surname: "Unknown",
      addresses: {},
    });

    initializeUser({ email: data.email, uid: userCredential.user.uid });
  } catch (error) {
    console.error("Registration error:", error.message);
    throw error;
  }
};

export const onLogin = async (data, initializeUser) => {
  try {
    const auth = getAuth();
    const userCredential = await signInWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );
    initializeUser({
      email: userCredential.user.email,
      uid: userCredential.user.uid,
    });
  } catch (error) {
    console.error("Login error:", error.message);
    throw error;
  }
};

export const onLogout = async () => {
  try {
    const auth = getAuth();
    await signOut(auth); // Correctly calling signOut with the modular SDK
    console.log("User logged out");
  } catch (error) {
    console.error("Logout error:", error.message);
    throw error;
  }
};
