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
                    document.getElementById('count').innerHTML = "Find Total available "
                        + "<span style='color: blue;'>" + count.length + "</span>" + " items";
                });
            });
            db.collection("unavailable").onSnapshot(function (doc) {
                doc.forEach(function (item) {

                    console.log(item.get("name"));

                    unavilableCount.push(item.get("name"));
                    console.log(unavilableCount);
                    console.log(unavilableCount.length);
                    document.getElementById('unavilableCount').innerHTML = "Find Total unavailable "
                        + "<span style='color: red;'>" + unavilableCount.length + "</span>" + " items";
                });
            });
        });
    })
}

countItem();

function toggleOnByInput() {
     $('#myonoffswitch').prop('checked', true).change()
     
    $('#products').empty();

    db.collection("Items").onSnapshot(function (doc) {
        doc.forEach(function (item) {
            $('#products').append('<tr><td data-th="Product"><div class="row"><a href="https://placeholder.com"><img src="https://via.placeholder.com/100"></a><h4 class="nomargin">' + item.get("name") + '</h4></div></td><td data-th=""></td><td data-th="Quantity"><input type="number" class="form-control text-center" value="1"></td><td data-th="Price" class="text-center">' + item.get("size") + '</td><td class="actions" data-th=""></td></tr>');
        });
    });
}

function toggleOffByInput() {
    $('#myonoffswitch').prop('checked', false).change()

    $('#products').empty();
    db.collection("unavailable").onSnapshot(function (doc) {
        doc.forEach(function (item) {
            $('#products').append('<tr><td data-th="Product"><div class="row"><a href="https://placeholder.com"><img src="https://via.placeholder.com/100"></a><h4 class="nomargin">' + item.get("name") + '</h4></div></td><td data-th=""></td><td data-th="Quantity"><input type="number" class="form-control text-center" value="1"></td><td data-th="Price" class="text-center">' + item.get("size") + '</td><td class="actions" data-th=""></td></tr>');
        });
    });


}
