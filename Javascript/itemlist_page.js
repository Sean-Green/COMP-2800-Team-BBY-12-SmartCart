$(document).ready(function () {

    //if true you can use the add button else no
    var addchecker = [];
    addchecker[0] = true;
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
            //console.log("item is" + itemname);

            content = $('#listarea2').html();
            itemname = $('#inputWeight').val();
            if (!$('#inputWeight').val()) {
                itemname = "Empty"
            }
            p = "<li id=weightmagic" + id + ">" + itemname + "</li>";
            $('#listarea2').html(content + p);
            $('#weightmagic' + id).appendTo("#listarea2");
            //console.log("weight is" + itemname);


            content = $('#listarea3').html();
            itemname = $('#inputQuantity').val();
            if (!$('#inputQuantity').val()) {
                itemname = 0
            }
            p = "<li id=quantitymagic" + id + "><span id=minus" + id + " class=decrementbutton>&#9664;&nbsp;&nbsp;</span>" + itemname +
                "<span id=plus" + id + "  class=incrementbutton>&nbsp;&nbsp;&#9654;</span></li>";
            $('#listarea3').html(content + p);
            $('#quantitymagic' + id).appendTo('#listarea3');
            // quantityholder.push(itemname);
            quantityholder.push(0);
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



    //function when click the DONE button for item list name
    //class added dynamically therefore use event delegation
    $(document).on('click', ".editbutton1", function () {
        //edit the title
        let userinput = $('#newlistname').val();
        $("#listname2span").html(userinput);
        $('#newlistname').remove();
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
    })

    //might remove this function***
    // //function when click the cancel button for item list name
    // $(document).on('click', ".editbutton2", function() {
    //     //reinput the saved string from array[0] as the title
    //     $("#listname2span").html(array[0]);
    //     //delete textbox
    //     $('#newlistname').remove();
    //     //delete confirm 
    //     $('.editbutton1').remove();
    //     //delete cancel
    //     $('.editbutton2').remove();
    //     //add edit button
    //     $("#editbuttondiv").html("<button class=editbutton>EDIT</button>");
    //     $(".editbutton").addClass("button"); 
    //     //removes the X remove button
    //     $('.removebutton').hide();
    //     //set add checker back to true to allow adds
    //     addchecker[0] = true;
    // })

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
        // console.log("id number is " + id);

        //get the current value from the array quantityholder[id](global) which is created when we added the item
        var currentvalue = quantityholder[id];
        console.log("quantityholder is " + quantityholder[id]);
        console.log("currentvalue is " + quantityholder[id]);
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

        //incrementation
        newholder[id] = newholder[id] + 1;
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

    db.collection("Items").get().then((snapshot) => {
        snapshot.docs.forEach(doc => {
            let listOfItems = '<option value="' + doc.get("name") + '">' + doc.get("name") +
                " " + doc.get("size") + " " + doc.get("units") + '</option>'
            $("#inputItem").append(listOfItems);
            console.log(doc.data())
        })
    })
});