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
         let userLists = snapshot.get("listNames");
         $("#listName").html("");
         for (i = 0; i < userLists.length; i++) {
            let listOfLists = '<li class="list-group-item" id="myList" id="listNameCheck' + i + '"><div><a><span id="listName' + i + '">' + userLists[i] + '</span></a></div>'
            let listText = $(listOfLists).text();
            listText = listText.trim();
            console.log(listText);
            listOfLists += '<span class="btn btn-danger" id="removeButton' + i + '">X</span></li>'
            $(document).on("click", "#removeButton" + i, function () {
               console.log(listText);
               deleteListByName(listText);
            })
            $("#listName").append(listOfLists);
            if (!editState) {
               $("#removeButton" + i).remove();
            }
            console.log(listOfLists);
         }
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
//let doomsDay = false;

function doomsDayState() {
   firebase.auth().onAuthStateChanged(function (user) {
      db.doc("Users/" + user.uid).get().then((snapshot) => {
         if (snapshot.get("DoomsDayMode")) {
            $("#createListBtn").html('<a class="btn btn-danger" href="itemlist_page.html">Create A New List</a>');
         } else {
            $("#createListBtn").html('<a class="btn btn-success" href="itemlist_page.html">Create A New List</a>');
         }
      })
   })
}
doomsDayState();


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
      
      let doomAudio = $("#doom")[0];
      doomAudio.play();
      $.fn.center = function () {
         this.css("position", "absolute");
         this.css("top", Math.max(0, (($(window).height() - $(this).outerHeight()) / 2) + $(window).scrollTop()) + "px");
         this.css("left", Math.max(0, (($(window).width() - $(this).outerWidth()) / 2) + $(window).scrollLeft()) + "px");
         return this;
      }
      $("#doomExplosion").fadeIn().center();
      setTimeout(function () {
         $("#doomExplosion").fadeOut()
      }, 2000);

   })
}

//test