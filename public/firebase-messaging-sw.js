importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyCGRHKFRh77uqaZfP_8XqU-CDFNWclwL5s",
  authDomain: "heyroutine-c64c1.firebaseapp.com",
  projectId: "heyroutine-c64c1",
  storageBucket: "heyroutine-c64c1.firebasestorage.app",
  messagingSenderId: "772562440500",
  appId: "1:772562440500:web:c10bd5c7ac10bd5c7ac782851a9d561",
  measurementId: "G-Q8CSBN13S3"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log("백그라운드 메시지:", payload);
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body
  });
});
