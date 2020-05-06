$(document).ready(function(){
    $(".editButton").on("click", function(){
        let name = $("#nameInput").val();
        let num = $("#numInput").val();
        $("#myList").html(name);
        let item = $("#myList").append(name);
    })
})

// function displayListName() {
//     let name = document.getElementById("nameInput").value;
//     let num = document.getElementById("numInput").value;
//     let item = document.createElement("li");
//     item.innerText = name;
//     document.getElementById("myList").innerHTML = '';
//     for (i = 0; i < num; i++) {
//         document.getElementById("myList").innerHTML += '<li>'+name+'</li>';
//     }
// }