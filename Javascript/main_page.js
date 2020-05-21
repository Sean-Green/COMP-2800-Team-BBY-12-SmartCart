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


// get User name from db
function getUserDisplayName() {
   firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
         $('#userName').text("Welcome " + user.displayName + "!");
      } else {
         console.log("user not signed in");
         name = 'fran';
      }
   });
};


// get user lists and display them for the user
let editMode = false;

function getUserLists(editState) {
   firebase.auth().onAuthStateChanged(function (user) {
      db.doc("Users/" + user.uid).onSnapshot((snapshot) => {

         // parse through the db and print the user's lists
         let userLists = snapshot.get("listNames");
         $("#listName").html("");
         for (i = 0; i < userLists.length; i++) {
            let lists = '<li class="list-group-item" id="myList"><div><span><button class="listNameBtn" id="listName' + i + '">' + userLists[i] + '</button></span></div>'
            let listText = $(lists).text();
            listText = listText.trim();
            // console.log(listText);
            console.log(userLists);

            // remove button in edit mode

            lists += '<span class="btn btn-remove" id="removeButton' + i + '">X</span></li>'
            //'<span class="btn btn-danger" id="removeButton' + i + '">X</span></li>'
            $(document).on("click", "#removeButton" + i, function () {
               console.log("handing over" + listText);
               deleteListByName(listText);
               //console.log(listText);
            })

            // appending the lists
            $("#listName").append(lists);

            // removing the remove buttons once edit mode is off
            if (!editState) {
               $("#removeButton" + i).remove();
            }
            console.log(lists);

            // setting the shopping list name to the list name that is clicked
            $(document).on("click", "#listName" + i, function () {
               console.log(listText);
               setShoppingList(listText);
            })
         }

         // set the list name as blank when the user clicks on create list button
         let defaultName = "";
         $(document).on("click", "#createListBtn", function () {
            setBaseShoppingList(defaultName);
         })
      })
   })
}


// function to have the name as blank when clicked
function setBaseShoppingList(defaultListName) {
   firebase.auth().onAuthStateChanged(function (user) {
      db.doc("Users/" + user.uid).set({
         shoppingList: defaultListName
      }, {
         merge: true
      }).then((success) => {
         redirect();
      })
   })
}


// Giving shopping list a name
function setShoppingList(listName) {
   firebase.auth().onAuthStateChanged(function (user) {
      let shopListName = listName;
      db.doc("Users/" + user.uid).set({
         shoppingList: shopListName
      }, {
         merge: true
      }).then((success) => {
         redirect();
      })
   })
}


// Redirecting the lists to the list page.
function redirect() {
   window.location = "itemlist_page.html";
}


// function to add/remove the remove buttons
$(document).on("click", "#editListsBtn", function () {
   if (!editMode) {
      getUserLists(true);
   } else {
      getUserLists(false);
   }
   editMode = !editMode;
})


// Doomsday feature button change
function doomsDayState() {
   firebase.auth().onAuthStateChanged(function (user) {
      db.doc("Users/" + user.uid).get().then((snapshot) => {
         if (snapshot.get("DoomsDayMode")) {
            $("#createListBtn").html('<div class="btn-doom"><span>CREATE A NEW LIST</span></div>');
            $("#footerNote").html("<p> To go back to normal mode: <span><button id='normBtn'>Click Here</button></span></p>");
         } else {
            $("#createListBtn").html('<div class="btn-create"><span>CREATE A NEW LIST</span></div>');
            $("#footerNote").html("<p class='hidden'> To go back to normal mode: <span><button id='normBtn'>Click Here</button></span></p>");
         }
      })
   })
}
doomsDayState();

// Back to normal from doomsday mode
function normalMode() {
   $(document).on("click", "#normBtn", function () {
      firebase.auth().onAuthStateChanged(function (user) {
         db.doc("Users/" + user.uid).get().then((snapshot) => {
            let doomTest = !snapshot.get("DoomsDayMode");
            db.doc("Users/" + user.uid).set({
               DoomsDayMode: doomTest
            }, {
               merge: true
            })
            doomsDayState();
         })
      })
   })
}
normalMode();


// Function to print user's list contents
function listSnapShots() {
   firebase.auth().onAuthStateChanged(function (user) {
      db.doc('Users/' + user.uid).get().then((userDoc) => {
         let userIndividualLists = userDoc.get("listNames");
         $("#userIndiLists").html("");

         for (i = 0; i < userIndividualLists.length; i++) {

            let itemListName = userIndividualLists[i];
            let listID = 'listing' + i;
            let ID = i;

            db.collection("Users/" + user.uid + "/" + userIndividualLists[i]).get().then((userListItems) => {

               // appending the main body and name title to an element
               console.log(itemListName);
               let itemCardMat = '<div class="card" id="mainListCard">' +
                  '<h4 class="heading1">' + itemListName + '</h4>' +
                  '<div class="card-body"><div class="card" class="listingCard">' +
                  '<ul class="list-group list-group-flush" class="ulList" id="' + listID + '"></ul>' +
                  '</div><div id="listButtonArea"><div id="listButton' + ID + '"class="btn-listEdit"' +
                  '<span>EDIT THIS LIST</span></div></div></div></div><div class="halfSpacer"></div>';
               $("#userIndiLists").append(itemCardMat);
               let itemCardMat2 = "";

               // looping to get all the items 
               for (j = 0; j < userListItems.docs.length; j++) {
                  let itemName = userListItems.docs[j].get("name");
                  itemCardMat2 += '<li class="list-group-item" id="theList"><div><span>' + itemName + '</span></div>'
                  console.log(itemCardMat2);
               }
               // appending the lists to an element
               console.log(listID);
               let appension = itemCardMat2 + "";
               console.log(appension);
               $('#' + listID).append(appension);

               // makes the Edit this list button take the user to the corresponding list
               $(document).on("click", "#listButton" + ID, function () {
                  console.log("THIS IS IT" + itemListName);
                  setShoppingList(itemListName);
               })
            })
         }
      })
   })
}
listSnapShots();