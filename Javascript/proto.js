// Function that creates a new document in the users collection
function createUser() {
   // if the current user logged in user
   // is authenticated, then grab "uid" "displayName" and "email"
   // use "set()" with merge (if document did not exist it will be created)
   firebase.auth().onAuthStateChanged(function (user) {
      db.collection("Users").doc(user.uid).set({
         "name": user.displayName,
         "email": user.email,
      }, {
         merge: true
      });
   });
}

//How to get details about the current user, from the firebase API:
//   We want 2 main things from this: 
//             .displayName and 
//             .uid
function getUserDetails() {
   firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
         console.log(user.displayName);
         console.log("Sign-in provider: " + user.providerId);
         ///////////// IMPORTANT ////////////////////////////////
         console.log("  Provider-specific UID: " + user.uid);
         console.log("  Name: " + user.displayName);
         ////////////////////////////////////////////////////////
         console.log("  Email: " + user.email);
         console.log("  Photo URL: " + user.photoURL);
      } else {
         console.log("user not signed in");
      }
   });
};

//Basic write function, note the list name in the header
function createListFromName(listName) {
   firebase.auth().onAuthStateChanged(function (user) {
      //Specify the base collection and then the doc path
      db.collection("Users/").doc(user.uid + "/Lists/" + listName).set({
         //Feed it JSON objects
         "eggs": "12",
         "bacon": "20",
      }, {
         //Set merge true if you want to add to a list, set false if you want to overwrite.
         merge: true
      });
   });
}

//Delete list by name
function deleteListByName(listName) {
   firebase.auth().onAuthStateChanged(function (user) {
      //Specify the base collection and then the doc path
      db.collection("Users/").doc(user.uid + "/Lists/" + listName).delete();
   });
}
// Basic function reading user profile data and displaying it to a marked div.
function getUserDisplayName() {
   firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
         $('#HelloUser').text("Hello " + user.displayName);
      } else {
         console.log("user not signed in");
         name = 'fran';
      }
   });
};
// logs the user out, should be called from a link to the splash page.
function logOut() {
   firebase.auth().signOut().then(function () {
      console.log("Logout succeeds");
   }, function (error) {
      console.log("logout fails: " + error);
   });
}