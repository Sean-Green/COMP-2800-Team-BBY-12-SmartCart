$(document).ready(() => {
    function displayList() {
        firebase.auth().onAuthStateChanged(function (user) {
            db.doc("Users/" + user.uid).get().then(function (userDoc) {
                let currentStore = userDoc.get("currentStore");
                let shoppingList = userDoc.get("shoppingList");
                let listHTML = "";
                $('#storename').prepend('<h3>' + currentStore + '</h3>');

                db.collection('Users/' + user.uid + '/' + shoppingList).get().then(userList => {
                    let item = userList.docs;
                    for (i = 0; i < item.length; i++) {

                        listHTML = 
                        '<tr id="itemContainer' + i + '">'+
                            '<td data-th="Product">' +
                                //The item image
                                '<image id="image' + i + '" width="100px "height="100" >' +
                                    //Item Name
                                '<h4 class="nomargin">' +
                                    '<span id="itemName' + i + '">' + item[i].get("name") + '</span>'+
                                '</h4> ' +
                            '</td>' +
                            //Edit qty buttons
                            '<td class="editButtons">' +
                                '<button class="btn btn-primary" id="increase' + i + '">' +
                                    '<i class="fa fa-plus"></i>'+
                                '</button>' +
                                //item qty
                                '<h1 id="qtyNum' + i + '"class="qtyNum">'+
                                    item[i].get("qty")+
                                '</h1>' +
                                '<button class="btn btn-primary" id="decrease' + i + '" >' +
                                    '<i class="fas fa-minus"></i>' +
                                '</button>' +
                            '</td>' +
                            // unavailable of delete button
                            '<td class="statusButtons">' +
                                '<button class="btn btn-success" id="remove' + i + '">' +
                                    '<i class="fa fa-check"></i>'+
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
                            $(qtyNum).text(parseInt($(qtyNum).text(), 10) + 1);
                        });

                        $(document).on('click', decreaseId, () => {
                            if ($(qtyNum).text() !== '0') {
                                $(qtyNum).text(parseInt($(qtyNum).text(), 10) - 1);
                            } else {

                            }
                        });

                        $(document).on('click', "#add" + i, () => {
                            $(containerName).removeClass("contAvail");
                            $(containerName).addClass("contUnavail");
                            $(nameId).addClass('unavailable');
                            console.log("adding " + itemName + "  to " + currentStore + " unavailable list");
                            addItemToUnavailable(itemName);
                        });
                        appendImage(str, i);
                    }


                });
            });
        });

    }
    displayList();

});


// Function that appends images to list items
// We could host these images in firebase, but we have a read limit so we hardcode them here
function appendImage(str, i) {
    if ((str === "Apple")) {
        $('#image' + [i]).attr('src', 'CSS/itemimage/apple.jpg');
    }
    if ((str === "Beans")) {
        $('#image' + [i]).attr('src', 'CSS/itemimage/Beans.jpg');
    }
    if ((str === "Canned Vegetables")) {
        $('#image' + [i]).attr('src', 'CSS/itemimage/Canned Vegetables.jpg');
    }
    if ((str === "Detergent")) {
        $('#image' + [i]).attr('src', 'CSS/itemimage/Detergent.jpg');
    }
    if ((str === "Disinfectant Wipes")) {
        $('#image' + [i]).attr('src', 'CSS/itemimage/Disinfectant Wipes.jpeg');
    }
    if ((str === "Eggs")) {
        $('#image' + [i]).attr('src', 'CSS/itemimage/Eggs.jpg');
    }
    if ((str === "Face Masks")) {
        $('#image' + [i]).attr('src', 'CSS/itemimage/Face Masks.jpeg');
    }
    if ((str === "Ground Beef")) {
        $('#image' + [i]).attr('src', 'CSS/itemimage/Ground Beef.jpg');
    }
    if ((str === "Hand Sanitizer")) {
        $('#image' + [i]).attr('src', 'CSS/itemimage/Hand Sanitizer.jpg');
    }
    if ((str === "Orange")) {
        $('#image' + [i]).attr('src', 'CSS/itemimage/Orange.jpg');
    }
    if ((str === "Pasta")) {
        $('#image' + [i]).attr('src', 'CSS/itemimage/Pasta.jpg');
    }
    if ((str === "Potato")) {
        $('#image' + [i]).attr('src', 'CSS/itemimage/Potato.jpg');
    }
    if ((str === "Rice")) {
        $('#image' + [i]).attr('src', 'CSS/itemimage/Rice.jpg');
    }
    if ((str === "Soap")) {
        $('#image' + [i]).attr('src', 'CSS/itemimage/Soap.jpg');
    }
    if ((str === "Toilet Paper")) {
        $('#image' + [i]).attr('src', 'CSS/itemimage/Toilet Paper.jpg');
    }
    if ((str === "Tylenol")) {
        $('#image' + [i]).attr('src', 'CSS/itemimage/Tylenol.jpg');
    }
    if ((str === "Uno Card Game")) {
        $('#image' + [i]).attr('src', 'CSS/itemimage/Uno Card Game.jpg');
    }
    if ((str === "Vitamin")) {
        $('#image' + [i]).attr('src', 'CSS/itemimage/Vitamin.jpg');
    }


}



function createUnavailableList(editListFlag) {
    var unavailableListName = new Date().toString().substring(0, 25).trim();
    deleteListByName(unavailableListName);
    var unavailableItems = $('.unavailable').toArray();

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
                    window.location = 'itemlist_page.html';
                } else {
                    window.location = 'store_page.html';
                }
            })
        })
    })



}
