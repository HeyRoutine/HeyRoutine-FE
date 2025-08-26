import React, { useEffect } from "react";
import { messaging } from "../../firebase/firebaseConfig";
import { getToken, onMessage } from "firebase/messaging";

export default function WebPushTestScreen() {
  useEffect(() => {
    // VAPID Key를 넣어 웹 푸시 토큰 요청
    getToken(messaging, { vapidKey: "YOUR_PUBLIC_VAPID_KEY" })
      .then(token => {
        console.log("웹 푸시 토큰:", token);
      })
      .catch(err => {
        console.error("웹 푸시 토큰 받기 실패:", err);
      });

    onMessage(messaging, (payload) => {
      console.log("포그라운드 알림 수신:", payload);
      alert(payload.notification?.title);
    });
  }, []);

  return <h1>Expo Web Firebase Push Test</h1>;
}
