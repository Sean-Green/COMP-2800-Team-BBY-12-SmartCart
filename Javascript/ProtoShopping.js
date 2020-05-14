$(document).ready(() => {
   function displayList() {
       $(document).ready(function () {

           firebase.auth().onAuthStateChanged(function (user) {
               console.log('building list');
               db.doc("Users/" + user.uid).get().then(function (userDoc) {
                   var currentStore = userDoc.get("currentStore");
                   var shoppingList = userDoc.get("shoppingList");
                   var listHTML = "";
                   $('#itemListContainer').prepend('<b>' + currentStore + '</b>');
                   db.collection('Users/' + user.uid + '/' + shoppingList).get().then(userList => {
                       let item = userList.docs;
                       for (i = 0; i < item.length; i++) {
                           listHTML += '<li><span id="itemName' + i + '">' + item[i].get("name") + '</span>';
                           let itemName = item[i].get("name");
                           console.log(itemName);
                           listHTML += '<button id="remove' + i + '">&#9989;</button><button id="add' + i + '">&#10060;</button></li>';
                           $('#itemList').append(listHTML);
                           listHTML = "";
                           $(document).on('click', "#remove" + i, () => {
                               console.log("removing "+itemName);
                               removeItemFromUnavailable(itemName);
                           });
                           $(document).on('click', "#add" + i, () => {
                               
                               console.log("adding "+itemName);
                               addItemToUnavailable(itemName);
                           });
                       }
                   });
               });
           });
       });
   }
   displayList();
});