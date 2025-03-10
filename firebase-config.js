// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA3TuoTLhIMt4uV5Xa1eYvYV_XiTacdKGc",
  authDomain: "api-bim-16567.firebaseapp.com",
  databaseURL: "https://api-bim-16567-default-rtdb.firebaseio.com",
  projectId: "api-bim-16567",
  storageBucket: "api-bim-16567.firebasestorage.app",
  messagingSenderId: "1021504862736",
  appId: "1:1021504862736:web:cadccd1af940e2d8fee895",
  measurementId: "G-0R0M9Q6M1P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);