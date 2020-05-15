$(document).ready(function () {


    var saveliststatus = false;
    var savelistname = "Placeholder";
    //get the user details
    firebase.auth().onAuthStateChanged(function (user) {
                //use the users ID to access their file
                db.doc("Users/" + user.uid).get().then(function (userDoc) {

                            // set user current shopping list
                            var shoppingList = userDoc.get("shoppingList");

                            console.log("Happy feet " + shoppingList);
                            if (userDoc.get("shoppingList") === '') {
                                console.log("row row row the boat");
                            } else {
                                db.collection('Users/' + user.uid + '/' + shoppingList).get().then(userList => {
                                    // we turn the documents into an array
                                    let item = userList.docs;
                                    saveliststatus = true;
                                    console.log(item);
                                    console.log("list name is " + shoppingList);
                                    savelistname = shoppingList;
                                    console.log("size of this List is: " + item.length);
                                    $("#listname2span").html(shoppingList);

                                    // loop through the array and add an <li> item for each item
                                    for (i = 0; i < item.length; i++) {
                                        let content = $('#listarea1').html();
                                        let p = "<li id=magicitem" + id + "> <span id=removeid" + id + " class=removebutton>&#10060;&nbsp;</span>" + item[i].get("name") + "</li>";
                                        $('#listarea1').html(content + p);
                                        $('#magicitem' + id).appendTo("#listarea1");

                                        content = $('#listarea2').html();
                                        let theweight = item[i].get("size") + " " + item[i].get("units");
                                        p = "<li id=weightmagic" + id + ">" + theweight + "</li>";
                                        $('#listarea2').html(content + p);
                                        $('#weightmagic' + id).appendTo("#listarea2");

                                        content = $('#listarea3').html();
                                        p = "<li id=quantitymagic" + id + "><span id=minus" + id + " class=decrementbutton>&#9664;&nbsp;&nbsp;</span>" + item[i].get("qty") +
                                            "<span id=plus" + id + "  class=incrementbutton>&nbsp;&nbsp;&#9654;</span></li>";
                                        $('#listarea3').html(content + p);
                                        $('#quantitymagic' + id).appendTo('#listarea3');
                                        quantityholder.push(item[i].get("qty"));
                                        id++
                                    }
                                });

           
            // lets you know on the page what store you will be writing to
            // $('#itemListContainer').prepend('<b>' + currentStore + '</b>');

            //////////////////////////////////////////////////////////////////////
            //          BUILDS A LIST FROM THE DATABASE INTO HTML               //
            //////////////////////////////////////////////////////////////////////
            // this reads the collection of user items from the database and stores it in userList

            // try {
            //     db.collection('Users/' + user.uid + '/' + shoppingList).get().then(userList => {
            //         // we turn the documents into an array
            //         let item = userList.docs;
            //         console.log(item);
            //         // loop through the array and add an <li> item for each item
            //         for (i = 0; i < item.length; i++) {
            //             listHTML += '<li><span id="itemName' + i + '">' + item[i].get("name") + '</span>';
            //             let itemName = item[i].get("name");
            //             console.log(itemName);
            //             listHTML += '<button id="remove' + i + '">&#9989;</button><button id="add' + i + '">&#10060;</button></li>';
            //             $('#itemList').append(listHTML);
            //             listHTML = "";
            //             $(document).on('click', "#remove" + i, () => {
            //                 console.log("removing " + itemName + " from " + currentStore + " unavailable list");
            //                 removeItemFromUnavailable(itemName);
            //             });
            //             $(document).on('click', "#add" + i, () => {

            //                 console.log("adding " + itemName + "  to " + currentStore + " unavailable list");
            //                 addItemToUnavailable(itemName);
            //             });
            //         }
            //     });
            // } catch {
            //     console.log("no List selected");
            // }

            }

            ////////////////////////////////////////////////////////////////////////
            ////////////////////////////////////////////////////////////////////////
            ////////////////////////////////////////////////////////////////////////
        });
    });






/////////////////////////////////////////////////////////////////////////////////////
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
                            databasestatus = true;
                        })

                    })
                })
            });

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
    //this is global boolean ready check if 0 database hasn't loaded if 1 database is loaded and ready
    var databasestatus = false;

    //item list page click add button to list the inputted Item Weight Quantity
    let id = 0;

    $('#theaddbutton').on('click', function () {

        //instantiate a variable to hold the [id] of the item if for a double of the item when it runs through
        //the forloop to check the item list [note: ignore the -1 it means nothing]
        let trueidposition = -1;
        //instantiate a variable to check if an item is a copy [true], not a copy [false]
        let uniquecheck = false;
        //the user input number for quantity so that we know how many times to increment the double item
        let userinputquantity = $('#inputQuantity').val();
        //if the input box has no input assume increment by 1
        if(userinputquantity == ''){
            userinputquantity = 1;
        }
        console.log("repeat is " + userinputquantity);
        //do the following code if there is an item in the item list, if empty list ignore
        if (id > 0) {
            let selecteditem = $('#inputItem').val();
            for (let position2 = 0; position2 <= id; position2++) {
                let currentitemlist = $("#magicitem" + position2).text().trim();
                currentitemlist = currentitemlist.substring(2);
                if (selecteditem === currentitemlist) {
                    uniquecheck = true;
                    trueidposition = position2;
                }
            }  
        }

        //if the item is a copy of something on the list run the following code that will
        //increment the quantity instead of adding an same item again on the item list
        if (uniquecheck === true) {
            for (let repeat = 0; repeat < userinputquantity; repeat++) {
                //get the current value from the array quantityholder[id](global) which is created when we added the item
                var currentvalue1 = quantityholder[trueidposition];
                // console.log("quantityholder is " + quantityholder[id]);
                // console.log("currentvalue is " + currentvalue);

                //Only if current value is 0 which means it is the first time incrementing, we will grab the 
                //quantity information using jquery for the source code
                //otherwise it will always grab the quantity number from the global array.
                if (currentvalue1 === 0) {
                    currentvalue1 = $("#quantitymagic" + trueidposition).val();
                }
                //created placeholder array because quantityholder array is undefined when used in a if statement to compare
                var newholder1 = quantityholder;

                //incrementation (for future reference dont use newholder[id] = newholder[id] + 1)
                newholder1[trueidposition]++

                //this is our item quantity code that we will dynamically update with each increment.

                p = "<span id=minus" + trueidposition + " class=decrementbutton>&#9664;&nbsp;&nbsp;</span>" + newholder1[trueidposition] +
                    "<span id=plus" + trueidposition + "  class=incrementbutton>&nbsp;&nbsp;&#9654;</span>";
                //this is implement and replace our old item quantity code with the new stored within variable p
                $("#quantitymagic" + trueidposition).html(p);
                //everytime we replace the code we need to reshow our increment and decrement button or else they will default hide
                $('.incrementbutton').show();
                $('.decrementbutton').show();
            }
        } else {
            //if maha's code is fully loaded then run the following code
            if (databasestatus == true) {
                //this else statement will run and add a new item to the item list which means it has checked
                //the item list and this is an unique item
                let content = $('#listarea1').html();
                let itemname = $('#inputItem').val();
                console.log("HAHHAHAHAHAHHA" + itemname);
                if (!$('#inputItem').val()) {
                    itemname = "Empty";
                }
      
                let p = "<li class='customListStyle' id=magicitem" + id + "> <span id=removeid" + id + " class=removebutton>&#10060;&nbsp;</span>" + itemname + "</li>";
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
                p = "<li class='customListStyle' id=weightmagic" + id + ">" + weight + "</li>";
                $('#listarea2').html(content + p);
                $('#weightmagic' + id).appendTo("#listarea2");
                //console.log("weight is" + itemname);


                content = $('#listarea3').html();
                itemname = $('#inputQuantity').val();
                if (!$('#inputQuantity').val()) {
                    itemname = 1
                }
                p = "<li class='customListStyle' id=quantitymagic" + id + "><span id=minus" + id + " class=decrementbutton>&#9664;&nbsp;&nbsp;</span>" + itemname +
                    "<span id=plus" + id + "  class=incrementbutton>&nbsp;&nbsp;&#9654;</span></li>";
                $('#listarea3').html(content + p);
                $('#quantitymagic' + id).appendTo('#listarea3');
                // quantityholder.push(itemname);
                quantityholder.push(itemname);
                //console.log("quantity is" + itemname);
                id++;
            }
        }
        

        
    })


    //adding basic css to the list items input boxes
    $('.theinput').css('border-radius', '3px');

    var array = [];
    array[0] = "null";


    // function when click the edit button for item list name
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
        //set add checker back to false to prevent adds
        addchecker[0] = false;
    })

    //CHANGE LIST NAME FUNCTION [contains 3 parts]
    //[function details]
    //the function makes it so that when you click the name it would let you type in new name
    //then you can click anywhere else on the page and it will finalize and replace the new name with
    //the old name.
    //In addition if you decide to leave the input box empty and click outside it will give you the 

    // //global variable to hold the old list name
    // var oldlistname;
    // //[part 1] - replaces the list name with an empty text box to enter new name in
    // // $(document).on('click', "#listname2span", function () {
    // $('#listname2span').click(function() {
    //     oldlistname = $("#listname2").text().trim();
    //     console.log("oldlistname " + oldlistname);
    //     $("#listname2").html('<input type="text" id="newlistname" size="7" placeholder="Enter List Name">')
    //     namechecker[0] = true;
    // })
    // //[part - 2] - this function will trigger when clicked outside set area from part 3
    // $(document).click(function() {
    //     if(namechecker[0] === true){
    //         let userinput = $('#newlistname').val();
    //         if (userinput === ''){
    //             userinput = oldlistname;
    //         }
    //         // $("#listname2span").html(userinput);
    //         $("#listname2").html('<span id="listname2span">' + userinput + '</span>');
    //         namechecker[0] = false;
    //     }
    //     // alert('clicked outside');
    // });
    // //[part - 3] - sets the area, if you click outside the area it will trigger above event
    // $("#listname2").click(function(event) {
    //     // alert('clicked inside');
    //     event.stopPropagation();
    // });

    $(document).on('click', "#newlistname", function () {
        namechecker[0] = true;
    })

    //function when click the DONE button for item list name
    //class added dynamically therefore use event delegation
    $(document).on('click', ".editbutton1", function () {
        //edit the title
        if(namechecker[0] === true) {
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
        //set add checker back to true to allow adds
        addchecker[0] = true;
        namechecker[0] = false;
    })

    //function that removes the whole line of item on the item list page
    $(document).on('click', ".removebutton", function () {
        let clickedid = $(this).attr('id').replace(/button/, '');
        let tempid = "";
        let position = 0;
        for (position = 0; position < clickedid.length; position++) {
            if (clickedid[position] >= '0' && clickedid[position] <= 9) {
                tempid = tempid + clickedid[position];
            }
        }
        $("#magicitem" + tempid).remove();
        $("#weightmagic" + tempid).remove();
        $("#quantitymagic" + tempid).remove();
    })

    //function that increments our quantity item.
    $(document).on('click', ".incrementbutton", function () {
        console.log("button works");
        //Obtains the ID number based from the idname you clicked
        let clickedid = $(this).attr('id').replace(/button/, '');
        let tempid = "";
        let position = 0;
        for (position = 0; position < clickedid.length; position++) {
            if (clickedid[position] >= '0' && clickedid[position] <= 9) {
                tempid = tempid + clickedid[position];
            }
        }
        // console.log("From Increment Function - id number is: " + id + " quantity is: " + quantityholder[id]);

        //get the current value from the array quantityholder[id](global) which is created when we added the item
        var currentvalue = quantityholder[tempid];
        // console.log("quantityholder is " + quantityholder[id]);
        // console.log("currentvalue is " + currentvalue);

        //Only if current value is 0 which means it is the first time incrementing, we will grab the 
        //quantity information using jquery for the source code
        //otherwise it will always grab the quantity number from the global array.
        if (currentvalue === 0) {
            currentvalue = $("#quantitymagic" + tempid).val();
        }
        //created placeholder array because quantityholder array is undefined when used in a if statement to compare
        var newholder = quantityholder;

        //incrementation (for future reference dont use newholder[id] = newholder[id] + 1)
        newholder[tempid]++

        //this is our item quantity code that we will dynamically update with each increment.

        p = "<span id=minus" + tempid + " class=decrementbutton>&#9664;&nbsp;&nbsp;</span>" + newholder[tempid] +
            "<span id=plus" + tempid + "  class=incrementbutton>&nbsp;&nbsp;&#9654;</span>";
        //this is implement and replace our old item quantity code with the new stored within variable p
        $("#quantitymagic" + tempid).html(p);
        //everytime we replace the code we need to reshow our increment and decrement button or else they will default hide
        $('.incrementbutton').show();
        $('.decrementbutton').show();
    })


    //function that decrement our quantity item.
    $(document).on('click', ".decrementbutton", function () {

        //Obtains the ID number based from the idname you clicked
        let clickedid = $(this).attr('id').replace(/button/, '');
        let tempid = "";
        let position = 0;
        for (position = 0; position < clickedid.length; position++) {
            if (clickedid[position] >= '0' && clickedid[position] <= 9) {
                tempid = tempid + clickedid[position];
            }
        }
        // console.log("id number is " + id);

        //get the current value from the array quantityholder[id](global) which is created when we added the item
        var currentvalue = quantityholder[tempid];
        //Only if current value is 0 which means it is the first time incrementing, we will grab the 
        // quantity information using jquery for the source code
        //otherwise it will always grab the quantity number from the global array.
        if (currentvalue === 0) {
            currentvalue = $("#quantitymagic" + tempid).val();
        }
        //created placeholder array because quantityholder array is undefined when used in a if statement to compare
        var newholder = quantityholder;
        //if the newholder placeholder array isn't equal to currentvalue. it would mean that 
        //quantityholder[id](global array) is not up to date, therefore this statement will update it.
        if (newholder[tempid] !== currentvalue) {
            quantityholder[tempid] = currentvalue;
        }

        //if the newholder[id] is equal or larger than 1 you can decrement or else no
        if (newholder[tempid] >= 1) {
            newholder[tempid] = newholder[tempid] - 1;
            //not sure if we need this code below but doesnt look like it keep for now though
            // newholder[id] = quantityholder[id];

            //this is our item quantity code that we will dynamically update with each increment.
            p = "<span id=minus" + tempid + " class=decrementbutton>&#9664;&nbsp;&nbsp;</span>" + newholder[tempid] +
            "<span id=plus" + tempid + "  class=incrementbutton>&nbsp;&nbsp;&#9654;</span>";

            //this is implement and replace our old item quantity code with the new stored within variable p
            $("#quantitymagic" + tempid).html(p);
            //everytime we replace the code we need to reshow our increment and decrement button or else they will default hide
            $('.incrementbutton').show();
            $('.decrementbutton').show();
        }

    })



    //if valid shopping = 0 you cannot press go shopping
    //if valid shopping = 1 you can press go shopping
    var validshopping = 0;

    //function that writes our items name, item quantity and item weight to the database
    //after pressing it you remain on the same page incase you need to edit.
    // $(document).on('click', ".savelistbutton", function () {

    //     validshopping = 1;
    //     $("#containerforshopbutton").html('<a class="goshopbutton" href="store_page.html"><i class="fa fa-search"></i></a>')
    //     $(".goshopbutton").hover(function () {
    //         $(this).css("background-color", "rgb(84, 218, 66)");
    //     }, function () {
    //         $(this).css("background-color", "white");
    //     });
    //     $(".goshopbutton").css("color", "green");
        
    //     let listname = array[0].trim();
    //     console.log("listname is " + listname);
    //     console.log(listname);
    //     deleteListByName(listname);
        
    //     let betaitem;
    //     let item;
    //     let betaquantity;
    //     let quantity;
    //     let check;
    //     // console.log("hi");
    //     for(let position = 0; position <= id; position++){
    //         check = $("#magicitem" + position).text()
    //         if (check !== ''){
    //             betaitem = $("#magicitem" + position).text().trim();
    //             betaquantity = $("#quantitymagic" + position).text().trim();
    //             quantity = betaquantity.substring(3,betaquantity.length - 3);
    //             // console.log("quantity is " + quantity);
    //             item = betaitem.substring(2);
    //             // console.log("item is " + item);
    //             saveItemToList(item, listname, quantity);
    //         } 
    //     }
    // });

    //function that write our item name, item quantity and item weight to the database
    //same functionality as the save list button but you will not stay on the same page instead it will
    //take you directly to the stores page to find the right stores for the user.
    $(document).on('click', ".goshopbutton", function () {

        let listname = array[0].trim();

        if(saveliststatus === true){
            listname = savelistname;
            saveliststatus = false;
        }
        console.log("listname is " + listname);
        console.log(listname);
        deleteListByName(listname);
        
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

        if(validshopping === 0){
            validshopping = 1;
            console.log("validshopping is " + validshopping);
            // $("#containerforshopbutton").html('<a class="goshopbutton" href="store_page.html"><i class="fa fa-search"></i></a>')
            $("#containerforshopbutton").html('<a class="goshopbutton" href="store_page.html"><span id="goshopstatus3">[READY]</span><span id="goshopstatus4"> GO SHOP</span></a>')
            $(".goshopbutton").hover(function () {
                $(this).css("background-color", "rgb(84, 218, 66)");
            }, function () {
                $(this).css("background-color", "white");
            });
            $(".goshopbutton").css("color", "green");
            alert('LIST SAVED! CLICK AGAIN TO SHOP');
        }
    });

});