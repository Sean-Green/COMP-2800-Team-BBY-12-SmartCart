function storelists() {
    $(document).ready(function () {
        firebase.auth().onAuthStateChanged(function (user) {
            db.collection("Stores").onSnapshot(function (doc) {
                doc.forEach(function (item) {
                    $('#stores').append('<div class="col-md-4"><div class="card mb-4 shadow-sm"><svg class="bd-placeholder-img card-img-top" width="100%" height="225"xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false"role="img" aria-label="Placeholder: Thumbnail"><title>Placeholder</title><rect width="100%" height="100%" fill="#55595c"></rect><text x="50%" y="50%" fill="#eceeef"dy=".3em">Backgroud image</text></svg><div class="card-body"><h4>' + item.get("name") + '</h4><p class="card-text">' + item.get("address") + '</p><div class="d-flex justify-content-between align-items-center"><div class="btn-group"><button type="button" class="btn btn-sm btn-outline-secondary" data-toggle="modal"data-target="#myModal">Store detail</button><div class="modal fade" id="myModal" role="dialog"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><h3 class="modal-title">' + item.get("name") + '</h3><h4 class="storeItemCount" id="medAva1">1/2 items</h4></div><div class="modal-body"><ul class="list-group list-group-flush"><li class="list-group-item">Items<div class="storeItemAvailiablity">item avaliablity</div></li><li class="list-group-item">Milk<div class="storeItemAvailiablity" id="yesAva">Yes</div></li><li class="list-group-item">Face Masks<div class="storeItemAvailiablity" id="noAva">No</div></li></ul></div><div class="modal-footer"><button type="button" class="btn btn-default" id="chooseStoreBtn"><a href="shoping_page.html">Go Shopping!</a></button><button type="button" class="btn btn-default" data-dismiss="modal"id="modalCloseBtn">Close</button></div></div></div> </div></div><small class="text-muted">9 mins(Track gps - add later)</small></div></div></div></div>');
                });
            });
        });
    })
}
storelists();