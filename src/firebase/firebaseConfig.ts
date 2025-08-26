// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging } from "firebase/messaging";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCGRHKFRh77uqaZfP_8XqU-CDFNWclwL5s",
  authDomain: "heyroutine-c64c1.firebaseapp.com",
  projectId: "heyroutine-c64c1",
  storageBucket: "heyroutine-c64c1.firebasestorage.app",
  messagingSenderId: "772562440500",
  appId: "1:772562440500:web:c10bd5c7ac782851a9d561",
  measurementId: "G-Q8CSBN13S3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const messaging = getMessaging(app);

export { app, analytics, messaging };
