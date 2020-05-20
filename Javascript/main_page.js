/**
     * [window.on("load")]
     * Normally this will fadeout the loading page when the window is fully loaded
     * but because the loading page went by too quickly I have to add a delay function
     */
    $(window).on("load", function () {
      delay(function () {
          $(".loader-wrapper").fadeOut("slow");
      }, 800);
  });

  /**
   * [delay FUNCTION]
   * delays anything done within it, 1000 = 1 second
   * credit: CMS
   * link: https://stackoverflow.com/questions/1909441/how-to-delay-the-keyup-handler-until-the-user-stops-typing
   */
  var delay = (function () {
      var timer = 0;
      return function (callback, ms) {
          clearTimeout(timer);
          timer = setTimeout(callback, ms);
      };
  })();

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
            $("#createListBtn").html('<a class="btn btn-danger">Create A New Doomsday List</a>');
            $("#footerNote").html("To go back to normal mode, visit About Us page.")
         } else {
            $("#createListBtn").html('<div class="btn btn-create"><span>CREATE A NEW LIST</span></div>');
         }
      })
   })
}
doomsDayState();


// Function to print user's list contents
function listSnapShots() {
   firebase.auth().onAuthStateChanged(function (user) {
      db.doc('Users/' + user.uid).get().then((userDoc) => {
         let userIndividualLists = userDoc.get("listNames");
         $("#userIndiLists").html("");

         for (i = 0; i < userIndividualLists.length; i++) {
            let nameOfLists = userIndividualLists[i];
            db.collection("Users/" + user.uid + "/" + userIndividualLists[i]).get().then((userListItems) => {

               console.log("this is list name " + nameOfLists);

               let userItemArray = userListItems.docs;
         
               let itemCardMat = '<div id="newOne' + i + '">' + nameOfLists + '<div id="listing' + i + '"></div></div>'
               console.log(itemCardMat);
                  //'<div class="card" id="mainListCard"><h4 class="heading1">' + nameOfLists + '</h4>' +
                  //'<div class="card-body"><div class="card" class="listingCard">' +
                  //'<div class="card"><ul class="list-group list-group-flush" class="ulList" id="listing' + i + '"></ul>'
                  //</div><div id="listButtonArea"><div class="btn btn-edit" id="editListsBtn">' +
                  //'<span>EDIT LISTS</span></div></div></div></div></div>';

               $("#userIndiLists").append(itemCardMat);
               console.log(userItemArray.length);

               let itemCardMat2 = "";
               for (j = 0; j < userItemArray.length; j++) {
                  let itemName = userItemArray[j].get("name");
                  itemCardMat2 += itemName;
                  //'<li class="list-group-item" id="theList' + j + '"><div><span><button class="listNameBtn" id="listName' + j + '">' + itemName + '</button></span></div>'
                  console.log("this is name " + itemName)
               }
               $("#listing" + i).append(itemCardMat2);
            
            })
         }
      })
   })
}
listSnapShots();
//'<li class="list-group-item" id="myList"><div><span id="itemName' + i + '">' + userItemArray + '</span></div>'

//'<li class="list-group-item" id="myList"><div><span id="itemName' + j + '">' + itemName + '</span></div>'