import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";
import {getAuth, onAuthStateChanged} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCv0ncr9YAWtlHtXSCWtKvdUccxhpSquE8",
  authDomain: "media-ced44.firebaseapp.com",
  projectId: "media-ced44",
  storageBucket: "media-ced44.appspot.com",
  messagingSenderId: "985810945755",
  appId: "1:985810945755:web:32abd5ea9f34acc5aaaefe"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


export { auth, db, onAuthStateChanged};   