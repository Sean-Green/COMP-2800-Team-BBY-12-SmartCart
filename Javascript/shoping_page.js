//////////////////////////////////////////////////////////////////////////////////////////
// 
/////////////////////////////////////////////////////////////////////////////////////////
$(document).ready(() => {
    function displayList() {
        firebase.auth().onAuthStateChanged(function (user) {
            db.doc("Users/" + user.uid).get().then(function (userDoc) {
                let currentStore = userDoc.get("currentStore");
                let shoppingList = userDoc.get("shoppingList");
                let listHTML = "";
                $('#storename').prepend('<h3>You are shopping at <br><b>' + currentStore + '</b><br>With List:<br><b id="theListName">' + userDoc.get("shoppingList") + '</b></h3>');

                db.collection('Users/' + user.uid + '/' + shoppingList).get().then(userList => {
                    let item = userList.docs;
                    for (i = 0; i < item.length; i++) {

                        listHTML =
                            '<tr id="itemContainer' + i + '">' +
                            '<td data-th="Product">' +
                            //The item image
                            '<image id="image' + i + '" width="100px "height="100" >' +
                            //Item Name
                            '<h4 class="nomargin">' +
                            '<span id="itemName' + i + '"class="saveItem">' + item[i].get("name") + '</span>' +
                            '</h4> ' +
                            '</td>' +
                            //Edit qty buttons
                            '<td class="editButtons">' +
                            '<button class="btn btn-primary" id="increase' + i + '">' +
                            '<i class="fa fa-plus"></i>' +
                            '</button>' +
                            //item qty
                            '<h1 id="qtyNum' + i + '" class="qtyNum">' +
                            item[i].get("qty") +
                            '</h1>' +
                            '<button class="btn btn-primary" id="decrease' + i + '" >' +
                            '<i class="fas fa-minus"></i>' +
                            '</button>' +
                            '</td>' +
                            // unavailable of delete button
                            '<td class="statusButtons">' +
                            '<button class="btn btn-success" id="remove' + i + '">' +
                            '<i class="fa fa-check"></i>' +
                            '</button>' +
                            '<button class="btn btn-danger" id="add' + i + '" >' +
                            '<i class="fas fa-times"></i>' +
                            '</button>' +
                            '</td>' +
                            '</tr>';

                        let itemName = item[i].get("name");
                        let containerName = "#itemContainer" + i;
                        let nameId = '#itemName' + i;
                        let increaseId = '#increase' + i;
                        let decreaseId = '#decrease' + i;
                        let qtyNum = '#qtyNum' + i;
                        let imageId = '#image' + i;

                        let str = itemName.toString();

                        $('#itemList').append(listHTML);
                        listHTML = "";

                        //
                        $(document).on('click', "#remove" + i, () => {
                            $(containerName).addClass("contAvail");
                            $(containerName).removeClass("contUnavail");
                            $(nameId).removeClass('unavailable');
                            console.log("removing " + itemName + " from " + currentStore + " unavailable list");
                            removeItemFromUnavailable(itemName);
                        });
                        //

                        $(document).on('click', increaseId, () => {
                            let currentNum = parseInt($(qtyNum).text(), 10)
                            if (currentNum === 0) {
                                appendImage(str, imageId);
                                // console.log(" fixing " + str + imageId);
                            }

                            $(qtyNum).text(parseInt($(qtyNum).text(), 10) + 1);
                        });

                        $(document).on('click', decreaseId, () => {
                            let currentNum = parseInt($(qtyNum).text(), 10)
                            if (currentNum - 1 > 0) {
                                $(qtyNum).text(parseInt($(qtyNum).text(), 10) - 1);
                            } else if (currentNum === 1) {
                                $(qtyNum).text(parseInt($(qtyNum).text(), 10) - 1);
                                deleteImage(imageId);
                                // console.log('delete ' + imageId);
                            }
                        });

                        $(document).on('click', "#add" + i, () => {
                            $(".uBtn").css('display', 'block');
                            $(containerName).removeClass("contAvail");
                            $(containerName).addClass("contUnavail");
                            $(nameId).addClass('unavailable');
                            console.log("adding " + itemName + "  to " + currentStore + " unavailable list");
                            addItemToUnavailable(itemName);
                        });

                        let booleanVariable = userDoc.get("DoomsDayMode");
                                
                        console.log(booleanVariable);   

                    if (booleanVariable){
                        appendImageDoomsday(str, imageId);

                    }
                    else{
                        appendImage(str, imageId);
                    }
                        
                        appendImage(str, imageId);
                        
                    }


                });
            });
        });

    }
    displayList();
});

function deleteImage(imageId) {
    $(imageId).attr('src', 'CSS/itemimage/deleted.jpg');
    // console.log('delete '+imageId);
}
function saveListToProfile() {
    if (confirm('Are you sure? Anything set to 0 will be deleted from your list.')) {
        deleteListByName($('#theListName').text());
        let itemNames = $('.saveItem').toArray();
        let itemQty = $('.qtyNum').toArray();
        for (i = 0; i < itemNames.length; i++) {
            // console.log(itemNames[i].innerHTML + $('#theListName').text() + itemQty[i].innerHTML)
            saveItemToList(itemNames[i].innerHTML, $('#theListName').text().trim(), itemQty[i].innerHTML);
            // if (i + 1 === itemNames.length) {
            //     resolve("success");
            // }
        }
        alert('List Saved');
    } else {
        reject("nope");
    }

}

// Function that appends images to list items
// We could host these images in firebase, but we have a read limit so we hardcode them here
function appendImage(str, imageId) {
    if ((str === "Apple")) {
        $(imageId).attr('src', 'CSS/itemimage/apple.jpg');
    }
    if ((str === "Beans")) {
        $(imageId).attr('src', 'CSS/itemimage/Beans.jpg');
    }
    if ((str === "Canned Vegetables")) {
        $(imageId).attr('src', 'CSS/itemimage/Canned Vegetables.jpg');
    }
    if ((str === "Detergent")) {
        $(imageId).attr('src', 'CSS/itemimage/Detergent.jpg');
    }
    if ((str === "Disinfectant Wipes")) {
        $(imageId).attr('src', 'CSS/itemimage/Disinfectant Wipes.jpeg');
    }
    if ((str === "Eggs")) {
        $(imageId).attr('src', 'CSS/itemimage/Eggs.jpg');
    }
    if ((str === "Face Masks")) {
        $(imageId).attr('src', 'CSS/itemimage/Face Masks.jpeg');
    }
    if ((str === "Ground Beef")) {
        $(imageId).attr('src', 'CSS/itemimage/Ground Beef.jpg');
    }
    if ((str === "Hand Sanitizer")) {
        $(imageId).attr('src', 'CSS/itemimage/Hand Sanitizer.jpg');
    }
    if ((str === "Orange")) {
        $(imageId).attr('src', 'CSS/itemimage/Orange.jpg');
    }
    if ((str === "Pasta")) {
        $(imageId).attr('src', 'CSS/itemimage/Pasta.jpg');
    }
    if ((str === "Potato")) {
        $(imageId).attr('src', 'CSS/itemimage/Potato.jpg');
    }
    if ((str === "Rice")) {
        $(imageId).attr('src', 'CSS/itemimage/Rice.jpg');
    }
    if ((str === "Soap")) {
        $(imageId).attr('src', 'CSS/itemimage/Soap.jpg');
    }
    if ((str === "Toilet Paper")) {
        $(imageId).attr('src', 'CSS/itemimage/Toilet Paper.jpg');
    }
    if ((str === "Tylenol")) {
        $(imageId).attr('src', 'CSS/itemimage/Tylenol.jpg');
    }
    if ((str === "Uno Card Game")) {
        $(imageId).attr('src', 'CSS/itemimage/Uno Card Game.jpg');
    }
    if ((str === "Vitamin")) {
        $(imageId).attr('src', 'CSS/itemimage/Vitamin.jpg');
    }

}


function appendImageDoomsday(str, imageId) {
    if ((str === "Baseball Bat with Nail")) {
        $(imageId).attr('src', 'CSS/Doomsday image/baseball bat with nails.jpg');
    }
    if ((str === "Map")) {
        $(imageId).attr('src', 'CSS/Doomsday image/map.jpg');
    }
    if ((str === "Canned Beans")) {
        $(imageId).attr('src', 'CSS/Doomsday image/canned beans.jpeg');
    }
    if ((str === "Canned Vegetables")) {
        $(imageId).attr('src', 'CSS/Doomsday image/canned vegetables.jpg');
    }
    if ((str === "Dog best friend")) {
        $(imageId).attr('src', 'CSS/Doomsday image/dog best friend.png');
    }
    if ((str === "Flashlight")) {
        $(imageId).attr('src', 'CSS/Doomsday image/flashlight.jpg');
    }
    if ((str === "Grenade")) {
        $(imageId).attr('src', 'CSS/Doomsday image/grenade.jpg');
    }
    if ((str === "Guy That Always Freaking Out")) {
        $(imageId).attr('src', 'CSS/Doomsday image/guy that always freaking out.jpg');
    }
    if ((str === "Machete")) {
        $(imageId).attr('src', 'CSS/Doomsday image/machete');
    }
    if ((str === "Pistol Ammo")) {
        $(imageId).attr('src', 'CSS/Doomsday image/pistol ammo.jpg');
    }
    if ((str === "Pistol")) {
        $(imageId).attr('src', 'CSS/Doomsday image/pistol.jpg');
    }
    if ((str === "Prison made into Fortress")) {
        $(imageId).attr('src', 'CSS/Doomsday image/prison made into fortress.jpg');
    }
    if ((str === "Rock and Roll soundtrack")) {
        $(imageId).attr('src', 'CSS/Doomsday image/rock and roll soundtrack.jpg');
    }
    if ((str === "Rocket Launcher")) {
        $(imageId).attr('src', 'CSS/Doomsday image/rocket launcher.jpg');
    }
    if ((str === "Rockets")) {
        $(imageId).attr('src', 'CSS/Doomsday image/rockets.jpeg');
    }
    if ((str === "Rope")) {
        $(imageId).attr('src', 'CSS/Doomsday image/rope.jpg');
    }
    if ((str === "SlingShot ammo")) {
        $(imageId).attr('src', 'CSS/Doomsday image/slingshot ammo.jpg');
    }

    if ((str === "SlingShot")) {
        $(imageId).attr('src', 'CSS/Doomsday image/slingshot.jpg');
    }

    if ((str === "Spam")) {
        $(imageId).attr('src', 'CSS/Doomsday image/spam.jpg');
    }

    if ((str === "Sudden Betrayal")) {
        $(imageId).attr('src', 'CSS/Doomsday image/sudden betrayal.jpg');
    }
    if ((str === "Survival Kit")) {
        $(imageId).attr('src', 'CSS/Doomsday image/surviving kit.jpg');
    }
    if ((str === "Tragic Back Story")) {
        $(imageId).attr('src', 'CSS/Doomsday image/Tragic Backstories.jpg');
    }
    if ((str === "Zombie-Spray-Away")) {
        $(imageId).attr('src', 'CSS/Doomsday image/zombie spray away.jpg');
    }
    if ((str === "Zombie Truck")) {
        $(imageId).attr('src', 'CSS/Doomsday image/zombie truck.jpg');
    }
}



function createUnavailableList(editListFlag) {
    var unavailableListName = new Date().toString().substring(0, 25).trim();
    deleteListByName(unavailableListName);
    var unavailableItems = $('.unavailable').toArray();
    if (unavailableItems.length === 0) {
        alert("You must mark something unavailable to create a list from it.")
        return;
    }
    new Promise((resolve, reject) => {
        for (i = 0; i < unavailableItems.length; i++) {
            console.log(unavailableItems[i].innerHTML);
            saveItemToList(unavailableItems[i].innerHTML, unavailableListName, 1);
            if (i + 1 === unavailableItems.length) {
                setTimeout(() => {
                    resolve("success");
                }, 500);
            }
        }

    }).then((success) => {
        firebase.auth().onAuthStateChanged(function (user) {
            let shopListName = unavailableListName;
            db.doc("Users/" + user.uid).set({
                shoppingList: shopListName
            }, {
                merge: true
            }).then((success) => {

                if (editListFlag) {
                    console.log("Go to item Page");
                    window.location = 'itemlist_page.html';
                } else {
                    console.log
                    window.location = 'store_page.html';
                }
            })
        })
    })



}
