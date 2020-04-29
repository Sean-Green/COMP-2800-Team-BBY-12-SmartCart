// Modal js
let modal = document.getElementById("myModal");

let modalOpen = document.getElementById("myBtn");
modalOpen.onclick = function() {
  modal.style.display = "block";
}

let span = document.getElementsByClassName("close")[0];
span.onclick = function() {
  modal.style.display = "none";
}

window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}