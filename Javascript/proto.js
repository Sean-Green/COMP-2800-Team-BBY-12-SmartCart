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
            db.doc("Users/" + user.uid + "/" + listName + "/" + item.get("name")).set(item.data());
         });
      });
   });
}

//Delete list by name string
function deleteListByName(listName) {
   listName += "";
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

function compareUserToStoreList(userList, storeName){
   firebase.auth().onAuthStateChanged(function (user) {
      const USER = db.collection('Users/' + user.uid + "/" + userList).orderBy("name");
      const STORE = db.collection('Stores/' + storeName + "/unavailable").orderBy("name");
      unavailableItems = {};
      i = 0;
      USER.get().then((userItems)=>{
         STORE.get().then((storeItems)=>{
            userItems.forEach((uItem)=>{
               itemName = uItem.get("name");
               
            });
         });
      });
   });
}

//////////////////////////////////////////////////////////////////////////////////
// Functions that play with lists for testing are below:
//////////////////////////////////////////////////////////////////////////////////




// Basic read function that reads all the item documents out of the list collection, and adds them to a custom user list
function createFullList(listName) {
   //get user info, we need this for the user.uid
   firebase.auth().onAuthStateChanged(function (user) {
      //Get a reference to the collection which will serve as our list
      listRef = db.collection("Users/" + user.uid + "/" + listName);
      //Get a snapshot of all the item documents in the Items collection
      db.collection("Items").get().then(function (docS) {
         // for each document in the item collect
         qty = 1;
         docS.forEach(function (item) {
            // make a copy of it in the users list.
            saveItemToList(item.get("name"), listName, qty++);
         });
      });
   });
}

// Create a random list of unavailable items in a shop of your specification.
function createRandomShopShortageList(shopName) {
   //Get a reference to the collection which will serve as our list
   listRef = db.collection("Stores/" + shopName + "/unavailable");
   //Get a snapshot of all the item documents in the Items collection
   db.collection("Items").get().then(function (docS) {
      // for each document in the item collect
      docS.forEach(function (item) {
         // make a copy of it in the users list.
         if (getRandomInt(1, 3) == 2) {
            listRef.doc(item.get("name")).set(item.data());
         }
      });
   });

}
//builds the list on the prototype page
function buildList() {
   $(document).ready(function () {
      // READ Collection
      db.collection("Items").get().then(function (itemCollection) {
         itemCollection.forEach(function (item) {
            $('#ListItems').append('<li>' + item.get('name') + " " + item.get('size') + item.get('units') + '</li>');
         });
      });
   })
}

//helper
function getRandomInt(min, max) {
   min = Math.ceil(min);
   max = Math.floor(max);
   return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}