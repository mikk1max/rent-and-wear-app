import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { get, ref, set, update } from "firebase/database";
import {
  getAuth,
  signOut,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import { auth, db } from "../../firebase.config";

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
      name: data.name,
      surname: data.surname,
      addresses: "",
      isVerified: false,
    });

    const userData = {
      uid: userCredential.user.uid,
      email: userCredential.user.email,
      name: data.name,
      surname: data.surname,
      addresses: "",
      isVerified: false,
    };

    initializeUser(userData);
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
  try {
    await checkEmailVerification();
  } catch (error) {
    console.error("Error checking email verification:", error.message);
  }
};

export const onLogout = async () => {
  try {
    const auth = getAuth();
    await signOut(auth);
    console.log("User logged out");
  } catch (error) {
    console.error("Logout error:", error.message);
    throw error;
  }
};

export const onConfirmEmail = async () => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      await sendEmailVerification(user);
    } else {
      throw new Error("No user is currently signed in.");
    }
  } catch (error) {
    console.log("Confirmation error: ", error);
    throw error;
  }
};

export const checkEmailVerification = async () => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      await user.reload();

      if (user.emailVerified) {
        const userRef = ref(db, `users/${user.uid}`);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          const userData = snapshot.val();
          if (!userData.isVerified) {
            await update(userRef, {
              isVerified: true,
            });
          }
        }
      }
    }
  } catch (error) {
    console.error("Error while checking email verification:", error.message);
    throw error;
  }
};
export const resetPassword = async (email) => {
  // If `email` is an object, extract the actual email value
  const emailAddress = typeof email === "object" ? email.resetEmail : email;

  console.log("Email passed to Firebase:", emailAddress); // Debugging log

  try {
    if (!emailAddress || typeof emailAddress !== "string") {
      throw new Error("Invalid email address.");
    }

    await sendPasswordResetEmail(auth, emailAddress);

    console.log("Password reset email sent to:", emailAddress);
    return {
      message: "A password reset email has been sent to your email address.",
    };
  } catch (error) {
    console.error("Firebase error details:", error.code, error.message);
    throw new Error(
      error.message || "Failed to send password reset email. Please try again."
    );
  }
};
