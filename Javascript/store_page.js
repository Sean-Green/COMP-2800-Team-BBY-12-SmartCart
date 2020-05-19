storelists();

function storelists() {
    //get user info
    firebase.auth().onAuthStateChanged(function (user) {
        //get user doc
        db.doc('Users/' + user.uid).get().then((userDoc) => {
            try {
                db.collection('Users/' + user.uid + "/" + userDoc.get("shoppingList")).get().then((userItems) => {
                    db.collection("Stores").get().then(function (storeDocs) {
                        //for each store in the DB
                        var idNum = 0;
                        var shoppingList = userItems.docs;;
                        storeDocs.forEach(function (store) {
                            var unavail;
                            var pageHTML;
                            var itemCount;
                            //get the users list of items, and the stores list of unavailables
                            db.collection('Stores/' + store.get('name') + '/unavailable').get().then((unavailItems) => {
                                console.log(store.id);
                                itemCount = shoppingList.length;
                                unavail = unavailItems.docs;
                                //store card with modal //////////////////////////////////////////
                                pageHTML = '<div class="col-md-4"><div class="card mb-4 shadow-sm">'

                                    + '<image id="image' + idNum +'" width="100%" height="225" >'

                                    + '<title>' + store.get("name") + '</title><div class="card-body">'
                                    // set store name and store id num
                                    + '<h4 id="storeName' + idNum + '">' + store.get("name") + '</h4><p class="card-text">' + store.get("address") + '</p>'

                                    + '<div class="d-flex justify-content-between align-stores-center"><div class="btn-group"><button type="button" class="btn btn-sm btn-outline-secondary" data-toggle="modal"data-target="#myModal'
                                    // set modal id#

                                    +
                                    idNum + '">Store detail</button><div class="modal fade" id="myModal' + idNum + '" role="dialog"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><h3 class="modal-title">Item</h3><h4 class="storeItemCount" id="storeItemCount' +
                                    idNum + '"> items</h4></div><div class="modal-body"><ul id="itemList' + idNum + '"class="list-group list-group-flush">'


                                  $('#image0').attr('src', 'CSS/storeimage/Abbotsford Supermarket.jpg');
                                  $('#image1').attr('src', 'CSS/storeimage/IGA Richmond.jpg');
                                  $('#image2').attr('src', 'CSS/storeimage/Safeway Langley.jpg');
                                  $('#image3').attr('src', 'CSS/storeimage/Superstore.png');
                                  $('#image4').attr('src', 'CSS/storeimage/T&T Supermarket.png');
                                  $('#image5').attr('src', 'CSS/storeimage/Walmart.png');


                                for (i = 0; i < shoppingList.length; i++) {
                                    for (j = 0; j < unavail.length; j++) {
                                        // if the item is unavailable
                                        // add it to the list
                                        if (shoppingList[i].get("name") === unavail[j].get("name")) {
                                            itemCount--;
                                            // console.log(store.get('name') + ' is out of ' + shoppingList[i].get("name"));
                                            pageHTML += '<li class="list-group-item">' + shoppingList[i].get("name") + '<div class="storeItemAvailiablity" id="yesAva">OUT</div></li>';
                                        }
                                    }
                                }
                                pageHTML += '</ul></div><div class="modal-footer"><button type="button" class="btn btn-default" id="chooseStoreBtn">'
                                    //set go shopping button id
                                    +
                                    '<a id="takeThemShopping' + idNum + '">Go Shopping!</a></button><button type="button" class="btn btn-default" data-dismiss="modal"id="modalCloseBtn">Close</button></div></div></div> </div></div><small class="text-muted">9 mins(Track gps - add later)</small></div></div></div></div>'
                                $('#stores').append(pageHTML);
                                $('#storeItemCount' + idNum).text(itemCount + "/" + shoppingList.length);
                                if (itemCount === shoppingList.length) {
                                    $('#itemList' + idNum).append('<li>ALL ITEMS IN STOCK</li>');
                                }
                                var id = '#takeThemShopping' + idNum;
                                var headId = '#storeName' + idNum;
                                console.log(id)
                                $(id).click(() => {
                                    let storeName = $(headId).text();
                                    console.log(storeName + " is " + headId);
                                    setCurrentStore(storeName);
                                })

                                console.log(idNum++);
                            });

                        })
                    });

                });
            } catch {
                console.log('no list selected');
                let pageHTML = '<div id="noListContainer"><h1>No List Selected!</h1><a href="itemlist_page.html" class="btn btn-success">Create A New List</a></div>';
                $('#stores').append(pageHTML);
            }

        });
    })
}
// Giving shopping list a name
function setCurrentStore(storeName) {
    firebase.auth().onAuthStateChanged(function (user) {
        db.doc("Users/" + user.uid).set({
            currentStore: storeName
        }, {
            merge: true
        }).then((success) => {
            redirectToShop();
        })
    })
}

// Redirecting the lists to the list page.
function redirectToShop() {
    window.location = "shoping_page.html";
}