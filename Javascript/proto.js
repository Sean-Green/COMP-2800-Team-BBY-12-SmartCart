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

// Function that creates a new document in the users collection
function manageUser() {
   firebase.auth().onAuthStateChanged(function (user) {
      db.doc("Users/" + user.uid).get().then(function (doc) {
         if (doc.exists) {
            console.log("User Exists:", doc.data());
         } else {
            db.collection("Users").doc(user.uid).set({
               "name": user.displayName,
               "email": user.email,
               "listNames": []
            }, {
               merge: true
            });
            console.log("User Added");
         }
      }).catch(function (error) {
         console.log("Error getting document:", error);
      });
   });
}

// logs the user out, should be called from a link to the splash page.
function logOut() {
   firebase.auth().signOut().then(function () {
      console.log("Logout succeeds");
   }, function (error) {
      console.log("logout fails: " + error);
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


//////////////////////////////////////////////////////////////////////////////////
//                      IMPORTANT READ AND WRITE FUNCTIONS:
//////////////////////////////////////////////////////////////////////////////////

/* Saves an item to a list if the itemName exists in DB */
function saveItemToList(itemName, listName, qty) {
   firebase.auth().onAuthStateChanged(function (user) {
      // READ onSnapshot WORKS ON DOCS AND COLLECTIONS 
      // First grab a snapshot of the item specified.
      db.doc("Items/" + itemName).get().then(function (item) {
         console.log(item.data());
         // check listNames array for listname////////////////////////////////////////
         db.doc("Users/" + user.uid).get().then(function (userDoc) {
            var userLists = userDoc.get("listNames");
            var nameExists = false;
            for (i = 0; i < userLists.length && !nameExists; i++) {
               if (userLists[i] == listName) {
                  nameExists = true;
               }
            }
            if (!nameExists) {
               userLists.push(listName);
               // console.log("Adding list to listNames")
               // console.log(userLists); //////////
               //Add the list lists
               db.doc("Users/" + user.uid).set({
                  "listNames": userLists
               }, {
                  merge: true
               });
            }
            // Now save it under a specified list and .then() get the reference id
            db.collection("Users/" + user.uid + "/" + listName).add(item.data()).then(function (docRef) {
               // console.log("Document reference id: " + docRef.id);
               // WRITE set ONLY WORKS ON DOCS 
               // Using that docRef we can set the items qty
               db.doc("Users/" + user.uid + "/" + listName + "/" + docRef.id).set({
                  "qty": qty
               }, {
                  merge: true
               });
            });
         });
      });
   });
}

//Delete list by name string
function deleteListByName(listName) {
   firebase.auth().onAuthStateChanged(function (user) {
      //Delete the listName from the array
      db.doc("Users/" + user.uid).get().then(function (userDoc) {
         //copy the listName array, skip the list to be deleted
         var userLists = userDoc.get("listNames");
         var amendedLists = [];
         for (i = 0, j = 0; i < userLists.length; i++) {
            if (userLists[i] != listName) {
               amendedLists[j++] = userLists[i]
            }
         }
         //update the array in the db
         db.doc("Users/" + user.uid).set({
            "listNames": amendedLists
         }, {
            merge: true
         });
         //Delete the list
         db.collection("Users/" + user.uid + "/" + listName).get().then((listItems) => {
            listItems.forEach(function (item) {
               db.doc("Users/" + user.uid + "/" + listName + "/" + item.id).delete();
            });
         });
      });
   });
}
//Jason's Demo with Sean's Prototype (Don't Remove) 
function savelistfunction(itemName, listName, qty) {
   firebase.auth().onAuthStateChanged(function (user) {
      // READ onSnapshot WORKS ON DOCS AND COLLECTIONS 
      // First grab a snapshot of the item specified.
      db.doc("Items/" + itemName).onSnapshot(function (item) {
         console.log(item.data());
         // Save list under user listNames array
         db.doc("Users/" + user.uid).set({
            "listNames":[listName]
         }, {
            merge: true
         });
         // GOOD CODE SHOULD GO HERE

         // Now save it under a specified list, .then() get the reference id
         db.collection("Users/" + user.uid + "/" + listName).add(item.data()).then(function (docRef) {
            console.log("Document reference id: " + docRef.id);
            // WRITE set ONLY WORKS ON DOCS 
            // Using that docRef we can set the items qty
            db.doc("Users/" + user.uid + "/" + listName + "/" + docRef.id).set({
               "qty": qty
            }, {
               merge: true
            });
         });
      });
   });
}

