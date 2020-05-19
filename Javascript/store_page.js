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
                                pageHTML = '<div class="col-md-4"><div id="storeCard' + idNum + '" class="">'

                                    +
                                    '<div class="imgContain" ><image id="image' + idNum + '" padding="1em" object-fit="scale-down" width="100%"  ></div>'

                                    +
                                    '<title>' + store.get("name") + '</title><div  class="card-body">'
                                    // set store name and store id num
                                    +
                                    '<h4 id="storeName' + idNum + '">' + store.get("name") + '</h4><p class="card-text">' + store.get("address") + '</p>'

                                    +
                                    '<div class="d-flex justify-content-between align-stores-center"><div class="btn-group"><button type="button" class="detailsbtn btn btn-sm btn-outline-secondary" data-toggle="modal"data-target="#myModal'
                                    // set modal id#

                                    +
                                    idNum + '">Click for Details</button><div class="modal fade" id="myModal' + idNum + '" role="dialog"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><h3 id="UnavailableCount' +
                                    idNum + '" class="modal-title">Unavailable Items</h3>' +
                                    '<h4></h4></div><div class="modal-body"><ul id="itemList' +
                                    idNum + '"class="list-group list-group-flush">'





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
                                    '<a id="takeThemShopping' + idNum + '">Shop Here!</a></button><button type="button" class="btn btn-default" data-dismiss="modal"id="modalCloseBtn">Close</button></div></div></div> </div></div>' +
                                    '<small class="storeItemCount' + idNum + '" class="text-muted"></small></div></div></div></div>'
                                $('#stores').append(pageHTML);
                                $('.storeItemCount' + idNum).text(itemCount + "/" + shoppingList.length + " Items Available");
                                $('#UnavailableCount' + idNum).text(shoppingList.length - itemCount + " Items Out of Stock");
                                if (itemCount === shoppingList.length) {
                                    $('#itemList' + idNum).append('<li class="list-group-item">All items Available</li>');
                                }
                                if (itemCount / shoppingList.length === 1) {
                                    $('#storeCard' + idNum).addClass('fullyStocked');
                                } else if (itemCount / shoppingList.length === 0){
                                    $('#storeCard' + idNum).addClass('notStocked');
                                } else {
                                    $('#storeCard' + idNum).addClass('halfStocked');
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
                                // we could also get these images from the database,
                                // but because we have a read write limit we have chosen to hard code them
                                $('#image0').attr('src', 'CSS/storeimage/Abbotsford Supermarket.jpg');
                                $('#image1').attr('src', 'CSS/storeimage/IGA Richmond.jpg');
                                $('#image2').attr('src', 'CSS/storeimage/Safeway Langley.jpg');
                                $('#image3').attr('src', 'CSS/storeimage/Superstore.png');
                                $('#image4').attr('src', 'CSS/storeimage/T&T Supermarket.png');
                                $('#image5').attr('src', 'CSS/storeimage/Walmart.png');
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