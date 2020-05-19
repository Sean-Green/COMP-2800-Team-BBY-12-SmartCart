// Everyones discription
let seanDescription = "<p class='card-text'>I'm a term 2 student in CST, currently facing our projects term. Before coming to BCIT I had 10 years experience in the workforce in retail sales, as a delivery driver, warehouse worker, and electrical apprentice. I hope my experience at BCIT can one day lead to a job in games development.</p>"
let jasonDescription = "<p class='card-text'>Jason is a 2nd term CST student at BCIT. During his spare he enjoys playing video games like League of Legends and conversing with his fellow collegues about Object Oriented Programming concepts. Jason's huge passion for coding is only second to his love for home brewed Tim Hortons coffee.</p>"
let kimDescription = "<p class='card-text'>Our team aims to “work hardly and get as much effort as we can”. Projects are evolving day by day, with great teams working hardly and helping each other.</p>"
let mahaDescription = "<p class='card-text'>I am a term 1 student at BCIT. Before BCIT, I graduated from SFU with a Bsc in Health Science and Business. I am enjoying the comp-sci field alot, my favourite tasks while working on projects would be the front end. Outside of comp-sci, I enjoy activities such as sports, gaming and enterpreneurship meet and greets.</p>"
let team12CoffeesDescription = "<p class='card-text'>We are a group of Students in the BCIT CST program working on Smart Cart for our pojects term! When we are not coding or sleeping we are playing Team Fight Tactics or bot matches in League of Legends! For any questions or to 1v1 us in League, our email is coffee12@gmail.com.</p>"

// Doomsday mode that sets the mode on and off
function doomsDayMode() {
    $(document).on("click", "#doomsDayBtn", function () {
       firebase.auth().onAuthStateChanged(function (user) {
          db.doc("Users/" + user.uid).get().then((snapshot) => {
             let doomTest = !snapshot.get("DoomsDayMode");
             db.doc("Users/" + user.uid).set({
                DoomsDayMode: doomTest
             }, {
                merge: true
             })
             doomsDayState();
          })
       })
 
       // audio for button click
       let doomAudio = $("#doom")[0];
       doomAudio.play();
 
       // positioning for the image
       $.fn.center = function () {
          this.css("position", "absolute");
          this.css("top", Math.floor((($(window).height() - $(this).outerHeight()) / 5) + $(window).scrollTop()) + "px");
          this.css("left", Math.floor((($(window).width() - $(this).outerWidth()) / 2) + $(window).scrollLeft()) + "px");
          return this;
       }
 
       // making the image fade in and then fade out after 2 seconds
       $("#doomExplosion").fadeIn().center();
       setTimeout(function () {
          $("#doomExplosion").fadeOut()
       }, 2000);
 
    })
 }


 // Doomsday feature
function doomsDayState() {
    firebase.auth().onAuthStateChanged(function (user) {
       db.doc("Users/" + user.uid).get().then((snapshot) => {

            // Setting the page to be into doomsday mode
            if (snapshot.get("DoomsDayMode")) {
                $("#footerNote").html('<p id="footerNote">Copyright of SmartCart ltd, To return back to normal mode<span><button id="doomsDayBtn">Click Me</button></span></p>');
                $("#teamText0").html("DOOMS DAY!");
                $("#teamText1").html("DOOMS DAY!");
                $("#teamText2").html("DOOMS DAY!");
                $("#teamText3").html("DOOMS DAY!");
                $("#teamText4").html("DOOMS DAY!");
                $("#mainBody").css("background-color", "lightcoral");

            // Resetting the page back to its normal state
            } else {
                $("#teamText0").html(seanDescription);
                $("#teamText1").html(jasonDescription);
                $("#teamText2").html(kimDescription);
                $("#teamText3").html(mahaDescription);
                $("#teamText4").html(team12CoffeesDescription);
                $("#footerNote").html('<p id="footerNote">Copyright of SmartCart ltd, Inorder to prepare for the end of the world<span><button id="doomsDayBtn">DONOT Click Me</button></span></p>');
                $("#mainBody").css("background-color", "lightgreen");
            }
       })
    })
 }
 doomsDayState();