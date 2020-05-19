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
            lists += '<span class="btn btn-danger" id="removeButton' + i + '">X</span></li>'
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
            $(document).on("click", "#listName" + i, function(){
               console.log(listText);
               setShoppingList(listText);
            }) 
         }

         // set the list name as blank when the user clicks on create list button
         let defaultName = "";
            $(document).on("click", "#createListBtn", function(){
               setBaseShoppingList(defaultName);
            })
      })
   })
}


// function to have the name as blank when clicked
function setBaseShoppingList(defaultListName){
   firebase.auth().onAuthStateChanged(function (user) {
      db.doc("Users/" + user.uid).set({
         shoppingList: defaultListName
      }, {
         merge:true
      }).then((success) => {
         redirect();
      })
   })
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


// Doomsday feature
function doomsDayState() {
   firebase.auth().onAuthStateChanged(function (user) {
      db.doc("Users/" + user.uid).get().then((snapshot) => {
         if (snapshot.get("DoomsDayMode")) {
            $("#createListBtn").html('<a class="btn btn-danger">Create A New Doomsday List</a>');
            $("#footerNote").html('<p id="footerNote">Copyright of SmartCart ltd, To return back to normal mode<span><button id="doomsDayBtn">Click Me</button></span></p>');
         } else {
            $("#createListBtn").html('<a class="btn btn-success">Create A New List</a>');
            $("#footerNote").html('<p id="footerNote">Copyright of SmartCart ltd, Inorder to prepare for the end of the world<span><button id="doomsDayBtn">DONOT Click Me</button></span></p>');
         }
      })
   })
}
doomsDayState();


// Doomsday mode that sets the mode on and off
function doomsDayMode() {
   $(document).on("click", "#doomsDayBtn", function () {
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

      // audio for button click
      let doomAudio = $("#doom")[0];
      doomAudio.play();

      // positioning for the image
      $.fn.center = function () {
         this.css("position", "absolute");
         this.css("top", Math.floor((($(window).height() - $(this).outerHeight()) / 5) + $(window).scrollTop()) + "px");
         this.css("left", Math.floor((($(window).width() - $(this).outerWidth()) / 2) + $(window).scrollLeft()) + "px");
         return this;
      }

      // making the image fade in and then fade out after 2 seconds
      $("#doomExplosion").fadeIn().center();
      setTimeout(function () {
         $("#doomExplosion").fadeOut()
      }, 2000);

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
