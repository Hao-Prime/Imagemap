// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBZr6-ALeWvxjiWwfI8NkKfi1WuH6WFSs0",
  authDomain: "imagemap-41b40.firebaseapp.com",
  projectId: "imagemap-41b40",
  storageBucket: "imagemap-41b40.appspot.com",
  messagingSenderId: "412302031651",
  appId: "1:412302031651:web:111a1d5c77b864d16dea96"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
