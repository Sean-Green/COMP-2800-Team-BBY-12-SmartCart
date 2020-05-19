let count = [];
let unavilableCount = [];

/*
function countItem() {
    $(document).ready(function () {
        firebase.auth().onAuthStateChanged(function (user) {

            db.collection("Items").onSnapshot(function (doc) {
                doc.forEach(function (item) {
                    count.push(item.get("name"));
                    console.log(count);
                    console.log(count.length);
                    //  document.getElementById('count').innerHTML = "Find Total available "
                    //     + "<span style='color: blue;'>" + count.length + "</span>" + " items";
                });
            });
            db.collection("unavailable").onSnapshot(function (doc) {
                doc.forEach(function (item) {

                    console.log(item.get("name"));

                    unavilableCount.push(item.get("name"));
                    console.log(unavilableCount);
                    console.log(unavilableCount.length);
                    //document.getElementById('unavilableCount').innerHTML = "Find Total unavailable "
                    //    + "<span style='color: red;'>" + unavilableCount.length + "</span>" + " items";
                });
            });
        });
    })
}

countItem();
*/

let array = [];

$(document).ready(() => {

    function displayList() {
        $(document).ready(function () {

            firebase.auth().onAuthStateChanged(function (user) {
                db.doc("Users/" + user.uid).get().then(function (userDoc) {
                    let currentStore = userDoc.get("currentStore");
                    let shoppingList = userDoc.get("shoppingList");
                    let listHTML = "";
                    $('#storename').prepend('<h3>' + 'Your Store : ' + currentStore + '</h3>');

                    db.collection('Users/' + user.uid + '/' + shoppingList).get().then(userList => {
                        let item = userList.docs;
                        for (i = 0; i < item.length; i++) {

                            listHTML = '<tr id="itemContainer' + i + '"><td data-th="Product">' +
                                '<image id="image'+i+'" width="100px "height="100" >' +
                                '<h4 class="nomargin"><span id="itemName' + i + '">' + item[i].get("name") + '</span></h4></td>' +
                                '<td data-th=""></td><td class="actions" id="action"><button class="btn btn-success" id="remove' + i + '"><i class="fa fa-check"></i></button>' +
                                '</td><td class="actions" id="action"><button class="btn btn-danger" id="add' + i + '" ><i class="fas fa-times"></i></button></div></tr>';

                            let itemName = item[i].get("name");
                            let containerName = "#itemContainer" + i;
                            let nameId = '#itemName' + i;

                            let str = itemName.toString();
                            array.push(str);
                           


                            $('#itemList').append(listHTML);
                            listHTML = "";
                            $(document).on('click', "#remove" + i, () => {
                                $(containerName).css("background-color", "green");
                                $(nameId).removeClass('unavailable');
                                console.log("removing " + itemName + " from " + currentStore + " unavailable list");
                                removeItemFromUnavailable(itemName);
                            });


                            $(document).on('click', "#add" + i, () => {
                                $(containerName).css("background-color", "red");
                                $(nameId).addClass('unavailable');
                                console.log("adding " + itemName + "  to " + currentStore + " unavailable list");
                                addItemToUnavailable(itemName);
                            });

  
                            if (array.includes("Apple")) {
                                $('#image'+[i]).attr('src', 'CSS/itemimage/apple.jpg');
                            }
                             if (array.includes("Beans")) {
    
                                $('#image'+[i]).attr('src', 'CSS/itemimage/Beans.jpg');
                            }
                             if (array.includes("Canned Vegetables")){
                        
                                $('#image'+[i]).attr('src', 'CSS/itemimage/Canned Vegetables.jpg');
                            }
                             if (array.includes("Detergent")) {
                        
                                $('#image'+[i]).attr('src', 'CSS/itemimage/Detergent.jpg');
                            } 
                              if (array.includes("Disinfectant Wipes")) {
                        
                                $('#image'+[i]).attr('src', 'CSS/itemimage/Disinfectant Wipes.jpeg');
                            } 
                              if (array.includes("Eggs")) {
                        
                                $('#image'+[i]).attr('src', 'CSS/itemimage/Eggs.jpg');
                            } 
                              if (array.includes("Face Masks")){
                        
                                $('#image'+[i]).attr('src', 'CSS/itemimage/Face Masks.jpeg');
                            } 
                              if (array.includes("Ground Beef")) {
                        
                                $('#image'+[i]).attr('src', 'CSS/itemimage/Ground Beef.jpg');
                            } 
                             if (array.includes("Hand Sanitizer")) {
                        
                                $('#image'+[i]).attr('src', 'CSS/itemimage/Hand Sanitizer.jpg');
                            }
                              if (array.includes("Orange")) {
                        
                                $('#image'+[i]).attr('src', 'CSS/itemimage/Orange.jpg');
                            }
                              if (array.includes("Pasta")){
                        
                                $('#image'+[i]).attr('src', 'CSS/itemimage/Pasta.jpg');
                            }
                               if (array.includes("Potato")) {
                        
                                $('#image'+[i]).attr('src', 'CSS/itemimage/Potato.jpg');
                            }
                              if (array.includes("Rice")) {
                        
                                $('#image'+[i]).attr('src', 'CSS/itemimage/Rice.jpg');
                            }
                              if (array.includes("Soap")) {
                        
                                $('#image'+[i]).attr('src', 'CSS/itemimage/Soap.jpg');
                            }
                              if (array.includes("Toilet Paper")) {
                        
                                $('#image'+[i]).attr('src', 'CSS/itemimage/Toilet Paper.jpg');
                            }
                              if (array.includes("Tylenol")) {
                                $('#image'+[i]).attr('src', 'CSS/itemimage/Tylenol.jpg');
                            }
                              if (array.includes("Uno Card Game")){
                        
                                $('#image'+[i]).attr('src', 'CSS/itemimage/Uno Card Game.jpg');
                            }
                             if (array.includes("Vitamin")) {
                        
                                $('#image'+[i]).attr('src', 'CSS/itemimage/Vitamin.jpg');
                            }
                        }
                        console.log(array);
                        

                    });
                });
            });
        });
    }
    displayList();

});

console.log(array);












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


function edit() {
    window.location = "itemlist_page.html";
}


/*
function edit(){
    $('#itemList').empty();
    firebase.auth().onAuthStateChanged(function (user) {

        db.doc("Users/" + user.uid).get().then(function (userDoc) {

            let shoppingList = userDoc.get("shoppingList");

            let listHTML = "";

            db.collection('Users/' + user.uid + '/' + shoppingList).get().then(userList => {
                let item = userList.docs;
                for (i = 0; i < item.length; i++) {

                    listHTML += '<tr><td data-th="Product"><div class="row"><button>&#10060;&nbsp;</button><a href="https://placeholder.com">'
                    + '<img src="https://via.placeholder.com/100"></a><h4 class="nomargin"><span id="itemName' + i + '">' + item[i].get("name") + '</span></h4></div></td><td data-th="">';


                    let itemName = item[i].get("name");
                    console.log(itemName);
                    listHTML += '<button id="remove' + i + '">&#9989;</button></td><td class="actions" data-th=""><button id="add' + i + '">&#10060;</button></li>';


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
        });
    });


}
*/

/*
let id = 0;
firebase.auth().onAuthStateChanged(function (user) {
    db.doc("Users/" + user.uid).get().then(function (userDoc) {
        db.collection('Users/' + user.uid + '/' + userDoc.get('shoppingList')).get().then(function (userlist) {

            userlist.forEach(function (item) {
                //$('#products').append('<tr><td data-th="Product"><div class="row"><a href="https://placeholder.com"><img src="https://via.placeholder.com/100"></a><h4 class="nomargin">' + item.get("name") + '</h4></div></td><td data-th=""></td><td data-th="Quantity"><input type="number" class="form-control text-center" value="1"></td><td data-th="Price" class="text-center">' + item.get("size") + '</td><td class="actions" data-th=""><button class="btn btn-info btn-sm" id="green"' + id + ' ><i class="fa fa-refresh"></i></button><button class="btn btn-danger btn-sm" id="red"' + id + '><i class="fa fa-trash-o"></i></button></td></tr>');

                $('#products').append('<tr><td data-th="Product"><div class="row"><a href="https://placeholder.com/"><img src="https://via.placeholder.com/100"></a><h4 class="nomargin">' + item.get("name") + '</h4></div></td><td data-th=""></td><td id="availableBtnArea" class="text-center"><a class="btn btn-success" id="avaliableBtn">Avaliable</a></td><td id="unavailableBtnArea" class="text-center"><a class="btn btn-danger" id="unavaliableBtn">Unavaliable</a></td><td class="actions" data-th=""></td></tr>');

                id++


            })
        });
    });
});

*/





/*
let unavailablestate = false;

function toggleOffByInput() {
    if (unavailablestate) {
        $('#itemUnavailable').empty();
        $('#products').empty();
        db.collection("unavailable").onSnapshot(function (doc) {
            doc.forEach(function (item) {
                $('#products').append('<tr><td data-th="Product"><div class="row"><span>&#10060;&nbsp;</span><a href="https://placeholder.com"><img src="https://via.placeholder.com/100"></a><h4 class="nomargin">' + item.get("name") + '</h4></div></td><td data-th=""></td><td data-th="Quantity"><input type="number" class="form-control text-center" value="1"></td><td data-th="Price" class="text-center">' + item.get("size") + '</td><td class="actions" data-th=""></td></tr>');
            });
        });

        $("#itemUnavailable").append('<a href="itemlist_page.html" id="warning-button" class="btn btn-warning">Create List</a></li><li class="table-button3"><a href="store_page.html" id="success-button" class="btn btn-success">Shop with this</a>')

    }
    //$('#myonoffswitch').prop('checked', false).change()

    unavailablestate = true;
}
*/