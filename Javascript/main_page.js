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
 };


 // get user lists and display them for the user
 let editMode = false;
 function getUserLists (editState){
    firebase.auth().onAuthStateChanged(function (user) {
    db.doc("Users/" + user.uid).onSnapshot((snapshot) => {
        let userLists = snapshot.get("listNames"); 
        $("#listName").html("");
        for (i = 0; i < userLists.length; i++) {  
            let listOfLists = '<li class="list-group-item" id="myList" id="listNameCheck'+ i + '"><div><a><span id="listName'+ i +'">'+ userLists[i] + '</span></a></div>'
            let y = $(listOfLists).text();
            y = y.trim();
            console.log(y);
            listOfLists += '<span class="btn btn-danger" id="removeButton'+ i +'">X</span></li>'
            $(document).on("click", "#removeButton" + i, function(){
               console.log(y);
               deleteListByName(y);
            })
            $("#listName").append(listOfLists);
            if (!editState){
                $("#removeButton" + i).remove();
            }
            console.log(listOfLists);
        }
        })   
    })
 }

 $("#listName").text();

// function to add/remove the remove buttons
$(document).on("click","#editListsBtn", function(){
    if(!editMode){
        getUserLists(true);
    }
    else {
        getUserLists(false);
    }
    editMode = !editMode;
})
    
