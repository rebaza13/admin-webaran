// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyABpt1Xpe2P3BVfp9lh_VUFjfYeyeRXR30",
  authDomain: "veterinary-project-8744d.firebaseapp.com",
  projectId: "veterinary-project-8744d",
  storageBucket: "veterinary-project-8744d.appspot.com",
  messagingSenderId: "162297185966",
  appId: "1:162297185966:web:8709bd87329623e2830f3f",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const db = getFirestore(app);
