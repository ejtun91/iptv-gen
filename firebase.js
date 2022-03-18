// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage, ref, uploadBytesResumable } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAfGPqdU7pa2BctfdwBg4N8xT8QI5dRlrM",
  authDomain: "iptv-gen-e3a27.firebaseapp.com",
  projectId: "iptv-gen-e3a27",
  storageBucket: "iptv-gen-e3a27.appspot.com",
  messagingSenderId: "457438308207",
  appId: "1:457438308207:web:a31d103de55e15abd86a9a",
  measurementId: "G-L9HXRP075Y",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const storage = getStorage();

export { storage, ref, uploadBytesResumable };
