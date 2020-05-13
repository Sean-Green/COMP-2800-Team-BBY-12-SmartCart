function storelists() {
    $(document).ready(function () {
        //get user info
        firebase.auth().onAuthStateChanged(function (user) {
            //get user doc
            db.doc('Users/' + user.uid).get().then((userDoc) => {
                db.collection("Stores").get().then(function (storeDocs) {
                    //for each store in the DB
                    var idNum = 0;
                    storeDocs.forEach(function (store) {
                        var shoppingList;
                        var unavail;
                        var pageHTML;
                        var itemCount;
                        //get the users list of items, and the stores list of unavailables
                        db.collection('Users/' + user.uid + "/" + userDoc.get("shoppingList")).get().then((userItems) => {
                            db.collection('Stores/' + store.get('name') + '/unavailable').get().then((unavailItems) => {
                                shoppingList = userItems.docs;
                                itemCount = shoppingList.length;
                                unavail = unavailItems.docs;
                                //store card with modal //////////////////////////////////////////
                                pageHTML = '<div class="col-md-4"><div class="card mb-4 shadow-sm"><svg class="bd-placeholder-img card-img-top" width="100%" height="225"xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false"role="img" aria-label="Placeholder: Thumbnail"><title>Placeholder</title><rect width="100%" height="100%" fill="#55595c"></rect><text x="50%" y="50%" fill="#eceeef"dy=".3em">Backgroud image</text></svg><div class="card-body"><h4>'
                                    // set store details
                                    +
                                    store.get("name") + '</h4><p class="card-text">' + store.get("address") + '</p><div class="d-flex justify-content-between align-stores-center"><div class="btn-group"><button type="button" class="btn btn-sm btn-outline-secondary" data-toggle="modal"data-target="#myModal'
                                    // set modal id#
                                    +
                                    idNum + '">Store detail</button><div class="modal fade" id="myModal' + idNum + '" role="dialog"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><h3 class="modal-title">Item</h3><h4 class="storeItemCount" id="storeItemCount' +
                                    idNum + '"> items</h4></div><div class="modal-body"><ul id="itemList' + idNum + '"class="list-group list-group-flush">'
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
                                pageHTML += '</ul></div><div class="modal-footer"><button type="button" class="btn btn-default" id="chooseStoreBtn"><a href="shoping_page.html">Go Shopping!</a></button><button type="button" class="btn btn-default" data-dismiss="modal"id="modalCloseBtn">Close</button></div></div></div> </div></div><small class="text-muted">9 mins(Track gps - add later)</small></div></div></div></div>'
                                $('#stores').append(pageHTML);
                                $('#storeItemCount' + idNum).text(itemCount + "/" + shoppingList.length);
                                if (itemCount === shoppingList.length) {
                                    $('#itemList' + idNum).append('<li>ALL ITEMS IN STOCK</li>');
                                }
                                idNum++;
                            });

                        })
                    });

                });

            });
        });
    })

};


storelists();