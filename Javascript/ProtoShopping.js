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
                    // this reads the collection of user items from the database and stores it in userList
                    try {
                        db.collection('Users/' + user.uid + '/' + shoppingList).get().then(userList => {
                            // we turn the documents into an array
                            let item = userList.docs;
                            console.log(item);
                            // loop through the array and add an <li> item for each item
                            for (i = 0; i < item.length; i++) {
                                listHTML += '<div id="itemContainer' + i + '"><li><span id="itemName' + i + '">' + item[i].get("name") + '</span>';
                                let itemName = item[i].get("name");
                                let containerName = "#itemContainer" + i;
                                console.log(itemName);
                                listHTML += '<button id="remove' + i + '">&#9989;</button><button id="add' + i + '">&#10060;</button></div></li>';

                                $('#itemList').append(listHTML);
                                listHTML = "";
                                $(document).on('click', "#remove" + i, () => {                                    
                                    $(containerName).css("background-color","green");
                                    console.log("removing " + itemName + " from " + currentStore + " unavailable list");
                                    removeItemFromUnavailable(itemName);
                                });
                                $(document).on('click', "#add" + i, () => {
                                    $(containerName).css("background-color","red");
                                    console.log("adding " + itemName + "  to " + currentStore + " unavailable list");
                                    addItemToUnavailable(itemName);
                                });
                            }
                        });
                    } catch {
                        console.log("no List selected");
                    }
                    ////////////////////////////////////////////////////////////////////////
                    ////////////////////////////////////////////////////////////////////////
                    ////////////////////////////////////////////////////////////////////////
                });
            });
        });
    }
    displayList();
});