// For Firebase JS SDK v7.20.0 and later, measurementId is optional
 // export default fireBaseConfig;

 import firebase from "firebase";

 const fireBaseApp= firebase.initializeApp({
    apiKey: "AIzaSyBlvfgmrLYfR67ZEy5CeuYx6vlNRHBWRus",
    authDomain: "instagram-clone-react-c6bb7.firebaseapp.com",
    projectId: "instagram-clone-react-c6bb7",
    storageBucket: "instagram-clone-react-c6bb7.appspot.com",
    messagingSenderId: "44003258871",
    appId: "1:44003258871:web:a59af35abb2a5d77cf7ef2",
    measurementId: "G-HP5D6BCE5Z"
 } );

 const db = fireBaseApp.firestore();
 const auth = firebase.auth();
 const storage = firebase.storage();

 export {db, auth, storage};