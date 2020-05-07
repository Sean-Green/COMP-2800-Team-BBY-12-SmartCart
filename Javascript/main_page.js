// Fucntion that creates a new document in the users collection
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

// logs the user out, should be called from a link to the splash page.
function logOut(){
    firebase.auth().signOut().then(function() {
        console.log("Logout succeeds");
      }, function(error) {
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

    $("#editListBtn").on("click", function(){
        let p = "<li class='list-group-item' id='myList'><a href='itemlist_page.html'><span id='listName' class=removebutton>&#10060;&nbsp;</span><span>List placeholder</span></a></li>"
        $("#ulList").html(p);
    })


 };