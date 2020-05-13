$(document).ready(function () {

    //if true you can use the add button else no (only using addchecker[0] as boolean checker)
    //this is the global array that check boolean that checks if you are valid to add or not
    //during edit mode you cant add therefore set to false
    //during done mode you can add therefore set to true 
    var addchecker = [];
    addchecker[0] = true;
    var namechecker = [];
    namechecker[0] = false;
    //this is global array that holds the increments and decrements for item quantity
    var quantityholder = [];

    //item list page click add button to list the inputted Item Weight Quantity
    let id = 0;

    $('#theaddbutton').on('click', function () {
        if (addchecker[0] == true) {
            let content = $('#listarea1').html();
            let itemname = $('#inputItem').val();
            if (!$('#inputItem').val()) {
                itemname = "Empty";
            }
            let p = "<li id=magicitem" + id + "> <span id=removeid" + id + " class=removebutton>&#10060;&nbsp;</span>" + itemname + "</li>";
            $('#listarea1').html(content + p);
            $('#magicitem' + id).appendTo("#listarea1");
            console.log("99 item is" + itemname);

            //ghetto way to get size and unit from database item
            let position = 0;
            let weight = "";
            //passing the gloabl name size and unit array into these local array to be able to use without error
            let namearray2 = namearray;
            let sizearray2 = sizearray;
            let unitarray2 = unitarray;

            for (position = 0; position < namearray2.length; position++) {
                if (namearray2[position] === itemname) {
                    weight = weight + " " + sizearray2[position] + " " + unitarray2[position];
                    console.log(weight);
                }
            }
            content = $('#listarea2').html();
            // itemname = $('#inputWeight').val();
            // if (!$('#inputWeight').val()) {
            //     itemname = "Empty"
            // }
            p = "<li id=weightmagic" + id + ">" + weight + "</li>";
            $('#listarea2').html(content + p);
            $('#weightmagic' + id).appendTo("#listarea2");
            //console.log("weight is" + itemname);



            content = $('#listarea3').html();
            itemname = $('#inputQuantity').val();
            if (!$('#inputQuantity').val()) {
                itemname = 1
            }
            p = "<li id=quantitymagic" + id + "><span id=minus" + id + " class=decrementbutton>&#9664;&nbsp;&nbsp;</span>" + itemname +
                "<span id=plus" + id + "  class=incrementbutton>&nbsp;&nbsp;&#9654;</span></li>";
            $('#listarea3').html(content + p);
            $('#quantitymagic' + id).appendTo('#listarea3');
            // quantityholder.push(itemname);
            quantityholder.push(itemname);
            //console.log("quantity is" + itemname);
            id++;
        }

    })


    //adding basic css to the list items input boxes
    $('.theinput').css('border-radius', '3px');

    var array = [];
    array[0] = "null";


    //function when click the edit button for item list name
    // $('.editbutton').on('click', function() {
    $(document).on('click', ".editbutton", function () {
        let one = 1;
        let two = 2;
        //before you replace the content of the span list name save the name
        //when edit is clicked old name is saved in array check position 1
        array[0] = $("#listname2").text();
        //replace the default list name with a text box for user input
        $("#listname2span").html('<input type="text" id="newlistname" size="7" placeholder="List Name">')
        let content = $('#listname3').html();
        //prebuilt buttons for confirm (class="editbuttonone") and cancel (class="editbuttontwo") 
        let a = "<div><button class=editbutton" + one + ">DONE</button></div>";
        // let b = "<div><button class=editbutton" + two +">CANCEL</button></div>";
        //add the confirm button
        $('#listname3').html(content + a);
        //reinstantiate content for listname3 then add the cancel button to make it below
        //might remove cancel button therefore commented it out
        // content = $('#listname3').html();
        // $('#listname3').html(content + b);
        //remove the edit button
        $('.editbutton').remove();
        //shows the X remove button
        $('.removebutton').show();
        //shows the increment button on item quantity
        $('.incrementbutton').show();
        //shows the decrement button on item quantity
        $('.decrementbutton').show();
        //set add checker back to false to prevent adds
        addchecker[0] = false;

    })

    $(document).on('click', "#newlistname", function () {
        namechecker[0] = true;
    })


    //function when click the DONE button for item list name
    //class added dynamically therefore use event delegation
    $(document).on('click', ".editbutton1", function () {
        //edit the title
        if (namechecker[0] === true) {
            let userinput = $('#newlistname').val();
            $("#listname2span").html(userinput);
            $('#newlistname').remove();
        } else {
            $("#listname2span").html(array[0]);
            $('#newlistname').remove();
        }
        //delete the confirm and cancel button and replace with edit button
        $('.editbutton1').remove();
        $('.editbutton2').remove();
        $("#editbuttondiv").html("<button class=editbutton>EDIT</button>");
        $(".editbutton").addClass("button");
        array[0] = $("#listname2").text();
        //removes the X remove button
        $('.removebutton').hide();
        //removes the increment button on item quantity
        $('.incrementbutton').hide();
        //removes the decrement button on item quantity
        $('.decrementbutton').hide();
        //set add checker back to true to allow adds
        addchecker[0] = true;
        namechecker[0] = false;
    })

    //function that removes the whole line of item on the item list page
    $(document).on('click', ".removebutton", function () {
        let clickedid = $(this).attr('id').replace(/button/, '');
        let id = "";
        let position = 0;
        for (position = 0; position < clickedid.length; position++) {
            if (clickedid[position] >= '0' && clickedid[position] <= 9) {
                id = id + clickedid[position];
            }
        }
        $("#magicitem" + id).remove();
        $("#weightmagic" + id).remove();
        $("#quantitymagic" + id).remove();
    })

    //function that increments our quantity item.
    $(document).on('click', ".incrementbutton", function () {
        //Obtains the ID number based from the idname you clicked
        let clickedid = $(this).attr('id').replace(/button/, '');
        let id = "";
        let position = 0;
        for (position = 0; position < clickedid.length; position++) {
            if (clickedid[position] >= '0' && clickedid[position] <= 9) {
                id = id + clickedid[position];
            }
        }
        // console.log("From Increment Function - id number is: " + id + " quantity is: " + quantityholder[id]);

        //get the current value from the array quantityholder[id](global) which is created when we added the item
        var currentvalue = quantityholder[id];
        // console.log("quantityholder is " + quantityholder[id]);
        // console.log("currentvalue is " + currentvalue);

        //Only if current value is 0 which means it is the first time incrementing, we will grab the 
        //quantity information using jquery for the source code
        //otherwise it will always grab the quantity number from the global array.
        if (currentvalue === 0) {
            currentvalue = $("#quantitymagic" + id).val();
        }
        //created placeholder array because quantityholder array is undefined when used in a if statement to compare
        var newholder = quantityholder;

        //incrementation (for future reference dont use newholder[id] = newholder[id] + 1)
        newholder[id]++

        //this is our item quantity code that we will dynamically update with each increment.
        p = "<li id=quantitymagic" + id + "><span id=minus" + id + " class=decrementbutton>&#9664;&nbsp;&nbsp;</span>" + newholder[id] +
            "<span id=plus" + id + "  class=incrementbutton>&nbsp;&nbsp;&#9654;</span></li>";
        //this is implement and replace our old item quantity code with the new stored within variable p
        $("#quantitymagic" + id).html(p);
        //everytime we replace the code we need to reshow our increment and decrement button or else they will default hide
        $('.incrementbutton').show();
        $('.decrementbutton').show();
    })


    //function that decrement our quantity item.
    $(document).on('click', ".decrementbutton", function () {

        //Obtains the ID number based from the idname you clicked
        let clickedid = $(this).attr('id').replace(/button/, '');
        let id = "";
        let position = 0;
        for (position = 0; position < clickedid.length; position++) {
            if (clickedid[position] >= '0' && clickedid[position] <= 9) {
                id = id + clickedid[position];
            }
        }
        // console.log("id number is " + id);

        //get the current value from the array quantityholder[id](global) which is created when we added the item
        var currentvalue = quantityholder[id];
        //Only if current value is 0 which means it is the first time incrementing, we will grab the 
        // quantity information using jquery for the source code
        //otherwise it will always grab the quantity number from the global array.
        if (currentvalue === 0) {
            currentvalue = $("#quantitymagic" + id).val();
        }
        //created placeholder array because quantityholder array is undefined when used in a if statement to compare
        var newholder = quantityholder;
        //if the newholder placeholder array isn't equal to currentvalue. it would mean that 
        //quantityholder[id](global array) is not up to date, therefore this statement will update it.
        if (newholder[id] !== currentvalue) {
            quantityholder[id] = currentvalue;
        }

        //if the newholder[id] is equal or larger than 1 you can decrement or else no
        if (newholder[id] >= 1) {
            newholder[id] = newholder[id] - 1;
            //not sure if we need this code below but doesnt look like it keep for now though
            // newholder[id] = quantityholder[id];

            //this is our item quantity code that we will dynamically update with each increment.
            p = "<li id=quantitymagic" + id + "><span id=minus" + id + " class=decrementbutton>&#9664;&nbsp;&nbsp;</span>" + newholder[id] +
                "<span id=plus" + id + "  class=incrementbutton>&nbsp;&nbsp;&#9654;</span></li>";
            //this is implement and replace our old item quantity code with the new stored within variable p
            $("#quantitymagic" + id).html(p);
            //everytime we replace the code we need to reshow our increment and decrement button or else they will default hide
            $('.incrementbutton').show();
            $('.decrementbutton').show();
        }
    })

    //using arrays to access database information for item's name, size and unit
    var namearray = [];
    var sizearray = [];
    var unitarray = [];
    let databaseitemamount = 0;
    //maha code to link database item selection to our items
    firebase.auth().onAuthStateChanged(function (user) {
        db.doc("Users/" + user.uid).onSnapshot((snapshot) => {
            let path = "Items";
            if (snapshot.get("DoomsDayMode")) {
                path = "Doomsday";
            }
            db.collection(path).get().then((snapshot) => {
                snapshot.docs.forEach(doc => {
                    let listOfItems = '<option id=itemoption value="' + doc.get("name") + '">' + doc.get("name") + '</option>'
                    $("#inputItem").append(listOfItems);
                    // console.log(doc.data())
                    //ghetto way to get access database items name, size , and units
                    namearray.push(doc.get("name"));
                    sizearray.push(doc.get("size"));
                    unitarray.push(doc.get("units"));
                    databaseitemamount++;
                })

            })
        })
    });

    var validshopping = 0;

    //function that writes our items name, item quantity and item weight to the database
    //after pressing it you remain on the same page incase you need to edit.
    $(document).on('click', ".savelistbutton", function () {

        validshopping = 1;
        $("#containerforshopbutton").html('<a class="goshopbutton" href="store_page.html"><i class="fa fa-search"></i></a>')
        $(".goshopbutton").hover(function () {
            $(this).css("background-color", "rgb(84, 218, 66)");
        }, function () {
            $(this).css("background-color", "white");
        });
        $(".goshopbutton").css("color", "green");

        let listname = array[0].trim();
        console.log("listname is " + listname);
        console.log(listname);
        if (listname === 'Friday') {
            console.log("fire!!!")
        }
        for (let position2 = 0; position2 < 4; position2++) {
            if (position2 == 0) {
                deleteListByName(listname);
                break;
            }
        }

        let betaitem;
        let item;
        let betaquantity;
        let quantity;
        let check;
        // console.log("hi");
        for (let position = 0; position <= id; position++) {
            check = $("#magicitem" + position).text()
            if (check !== '') {
                betaitem = $("#magicitem" + position).text().trim();
                betaquantity = $("#quantitymagic" + position).text().trim();
                quantity = betaquantity.substring(3, betaquantity.length - 3);
                // console.log("quantity is " + quantity);
                item = betaitem.substring(2);
                // console.log("item is " + item);
                saveItemToList(item, listname, quantity);
            }
        }
    });

    //function that write our item name, item quantity and item weight to the database
    //same functionality as the save list button but you will not stay on the same page instead it will
    //take you directly to the stores page to find the right stores for the user.
    $(document).on('click', ".goshopbutton", function () {

        let listname = array[0].trim();
        console.log("listname is " + listname);
        console.log(listname);
        if (listname === 'Friday') {
            console.log("fire!!!")
        }
        for (let position2 = 0; position2 < 4; position2++) {
            if (position2 == 0) {
                deleteListByName(listname);
                break;
            }
        }

        let betaitem;
        let item;
        let betaquantity;
        let quantity;
        let check;
        // console.log("hi");
        for (let position = 0; position <= id; position++) {
            check = $("#magicitem" + position).text()
            if (check !== '') {
                betaitem = $("#magicitem" + position).text().trim();
                betaquantity = $("#quantitymagic" + position).text().trim();
                quantity = betaquantity.substring(3, betaquantity.length - 3);
                // console.log("quantity is " + quantity);
                item = betaitem.substring(2);
                // console.log("item is " + item);
                saveItemToList(item, listname, quantity);
            }
        }

        if (validshopping === 0) {
            console.log("validshopping is " + validshopping);
            $("#containerforshopbutton").html('<a class="goshopbutton" href="store_page.html"><i class="fa fa-search"></i></a>')
            $(".goshopbutton").hover(function () {
                $(this).css("background-color", "rgb(84, 218, 66)");
            }, function () {
                $(this).css("background-color", "white");
            });
            $(".goshopbutton").css("color", "green");
        }
    });

});