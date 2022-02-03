import { initializeApp } from 'firebase/app';
import { getFirestore } from "firebase/firestore";
import {getAuth} from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyD8ayB0jAOD-tPfDQzBuDtvdIHa9iLnrAc",
    authDomain: "todo-sign-in.firebaseapp.com",
    projectId: "todo-sign-in",
    storageBucket: "todo-sign-in.appspot.com",
    messagingSenderId: "242577784241",
    appId: "1:242577784241:web:83831580df115963955190"
};
  
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export const authentication = getAuth(app);

export default db;