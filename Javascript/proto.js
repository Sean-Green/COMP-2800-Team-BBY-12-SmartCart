//test
// Function that creates a new document in the users collection
function createUser() {
   // if the current user logged in user
   // is authenticated, then grab "uid" "displayName" and "email"
   // use "set()" with merge (if document did not exist it will be created)
   firebase.auth().onAuthStateChanged(function (user) {
      // var ref = db.ref("Users/" + user.uid);
      // ref.once("value").then(function(snapshot) {
      //    console.log(snapshot.data());
      // });
      db.collection("Users").doc(user.uid).set({
         "name": user.displayName,
         "email": user.email,
         //             "listNames": []
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

// Basic read function that reads all the item documents out of the list collection, and adds them to a custom user list
function createListFromName(listName) {
   //get user info, we need this for the user.uid
   firebase.auth().onAuthStateChanged(function (user) {
      //Get a reference to the collection which will serve as our list
      listRef = db.collection("Users/" + user.uid + "/" + listName);
      //Get a snapshot of all the item documents in the Items collection
      db.collection("Items").onSnapshot(function (docS) {
         // for each document in the item collect
         docS.forEach(function (item) {
            // make a copy of it in the users list.
            listRef.add(item.data());
         });
      });
   });
}

//Delete list by name string
function deleteListByName(listName) {
   firebase.auth().onAuthStateChanged(function (user) {
      //Specify the base collection and then the doc path
      db.collection("Users/").doc(user.uid + "/Lists/" + listName).delete();
   });
}
//Read a list from DB by name string
function readListByName(listName) {
   firebase.auth().onAuthStateChanged(function (user) {
      db.doc("Users/" + user.uid + "/Lists/" + listName).onSnapshot(function (doc) {
         $('#ListItems').text("eggs: " + doc.get("eggs"));

      });
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
// Builds a list of items from a name
function buildListByName(listName) {
   firebase.auth().onAuthStateChanged(function (user) {
      db.collection("Users").doc(user.uid + "/Lists/" + listName).onSnapshot(function (doc) {
         console.log(JSON.stringify(doc.data()));
      });
   });
}

function buildList() {
   $(document).ready(function () {
      // READ Collection
      db.collection("Items").onSnapshot(function (doc) {
         doc.forEach(function (item) {
            $('#ListItems').append('<li>' + item.get('name') + " " + item.get('size') + item.get('units') + '</li>');
         });
      });

   })
}

function saveItemToList(itemName, listName, qty) {
   firebase.auth().onAuthStateChanged(function (user) {
      // READ onSnapshot WORKS ON DOCS AND COLLECTIONS 
      // First grab a snapshot of the item specified.
      db.doc("Items/" + itemName).onSnapshot(function (item) {
         // console.log(item.data());
         // check listNames array for listname
         ////////////////////////////////////////////////////////////////////////////////////////////
         db.doc("Users/" + user.uid).onSnapshot(function (userDoc) {
            var userLists = userDoc.get("listNames");
            console.log(userLists); //////////////
            var nameExists = false;
            for (i = 0; i < userLists.length && !nameExists; i++) {
               if (userLists[i] == listName) {
                  nameExists = true;
               }
            }
            if (!nameExists) {
               userLists.push(listName);
               console.log("Adding list to listNames")
               console.log(userLists); //////////
               //Add the list lists
               db.doc("Users/" + user.uid).set({
                  "listNames": userLists
               }, {
                  merge: true
               });
            } else {
               console.log("NAME EXISTS");
            }
            //////////////////////////////////////////////////////////////////////////////////////////////
            // Now save it under a specified list, .then() get the reference id
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