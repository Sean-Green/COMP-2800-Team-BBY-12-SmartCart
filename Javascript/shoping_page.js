function lists() {
    $(document).ready(function () {
        firebase.auth().onAuthStateChanged(function (user) {
            db.collection("Items").onSnapshot(function (doc) {
                doc.forEach(function (item) {
                    $('#products').append('<tr><td data-th="Product"><div class="row"><a href="https://placeholder.com"><img src="https://via.placeholder.com/100"></a><h4 class="nomargin">'+ item.get("name")+'</h4></div></td><td data-th=""></td><td data-th="Quantity"><input type="number" class="form-control text-center" value="1"></td><td data-th="Price" class="text-center">'+item.get("size")+'</td><td class="actions" data-th=""><button class="btn btn-info btn-sm"><i class="fa fa-refresh"></i></button><button class="btn btn-danger btn-sm"><i class="fa fa-trash-o"></i></button></td></tr>');
                });
            });
        });
    })
}
lists();