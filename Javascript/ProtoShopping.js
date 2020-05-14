$(document).ready(() => {


    //Looks through a users currently chosen shopping list, and builds a list based on it.
    function displayList() {
        $(document).ready(function () {
            //get the user details
            firebase.auth().onAuthStateChanged(function (user) {
                //use the users ID to access their file
                db.doc("Users/" + user.uid).get().then(function (userDoc) {
                    // set the store we will access to the users current store
                    var currentStore = userDoc.get("currentStore");
                    // set user current shopping list
                    var shoppingList = userDoc.get("shoppingList");
                    // html variable which we will append
                    var listHTML = "";
                    // lets you know on the page what store you will be writing to
                    $('#itemListContainer').prepend('<b>' + currentStore + '</b>');

                     //////////////////////////////////////////////////////////////////////
                    //          BUILDS A LIST FROM THE DATABASE INTO HTML               //
                   //////////////////////////////////////////////////////////////////////
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
                                console.log("removing " + itemName + " from " + currentStore + " unavailable list");
                                removeItemFromUnavailable(itemName);
                            });
                            $(document).on('click', "#add" + i, () => {

                                console.log("adding " + itemName + "  to " + currentStore + " unavailable list");
                                addItemToUnavailable(itemName);
                            });
                        }
                    });
                    ////////////////////////////////////////////////////////////////////////
                   ////////////////////////////////////////////////////////////////////////
                  ////////////////////////////////////////////////////////////////////////
                });
            });
        });
    }
    displayList();
});