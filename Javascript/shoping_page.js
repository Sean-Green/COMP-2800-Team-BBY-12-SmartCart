let count = [];
let unavilableCount = [];


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

function Edit() {

    $('#products').empty();

    firebase.auth().onAuthStateChanged(function (user) {
        db.doc("Users/" + user.uid).get().then(function (userDoc) {
            db.collection('Users/' + user.uid + '/' + userDoc.get('shoppingList')).get().then(function (userlist) {

                userlist.forEach(function (item) {



                    $('#products').append('<tr><td data-th="Product"><div class="row"><span>&#10060;&nbsp;</span><a href="https://placeholder.com/"><img src="https://via.placeholder.com/100"></a><h4 class="nomargin">' + item.get("name") + '</h4></div></td><td data-th=""></td><td id="availableBtnArea" class="text-center"><a class="btn btn-success" id="avaliableBtn">Avaliable</a></td><td id="unavailableBtnArea" class="text-center"><a class="btn btn-danger" id="unavaliableBtn">Unavaliable</a></td><td class="actions" data-th=""></td></tr>');



                })
            });
        });
    });

}





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
