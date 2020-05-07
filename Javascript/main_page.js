// Fucntion that creates a new document in the users collection
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