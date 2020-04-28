 // Your web app's Firebase configuration
 var firebaseConfig = {
   apiKey: "AIzaSyBsycx5foANIEVCW4GDFX9zf_Rf_QRj8X4",
   authDomain: "smartcart-shopping-app.firebaseapp.com",
   databaseURL: "https://smartcart-shopping-app.firebaseio.com",
   projectId: "smartcart-shopping-app",
   storageBucket: "smartcart-shopping-app.appspot.com",
   messagingSenderId: "106400062216",
   appId: "1:106400062216:web:ef1c7a898e49318ff86abd"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();