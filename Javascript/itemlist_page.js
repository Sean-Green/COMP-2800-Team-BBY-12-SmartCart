$(document).ready(function () {

    //||******************************************************||
    //||******************************************************||
    //||******Declare and Instantiate Global Variables********||
    //||******************************************************||
    //||******************************************************||
    
    /**
     * [saveliststatus]
     * true if using a saved item list
     * false if using a new item list
     */
    var saveliststatus = false;

    /**
     * [savelistname]
     * if you select a saved item list it will reload the title from the saved item list
     * only used "Placeholder" for instantiation purpose, means nothing
     */
    var savelistname = "Placeholder";

    /**
     * [array]
     * instantiated as "null again" no reason behind it
     * holds the old name of an item list name when you edit, not make any changes and press done
     */
    var array = [];
    array[0] = "null again";

    /**
     * [namearray] 
     * contains firebase -> user -> selected item list -> all item names in the list
     * put all information in an array for ease of access
     */
    var namearray = [];

    /**
     * [sizearray] 
     * contains firebase -> user -> selected item list -> all item sizes in the list
     * put all information in an array for ease of access
     */
    var sizearray = [];

    /**
     * [unitarray] 
     * contains firebase -> user -> selected item list -> all item units in the list
     * put all information in an array for ease of access
     */
    var unitarray = [];

    /**
     * [databaseitemamount]
     * quick way to check size of the database items
     * honestly not quite sure what this is for but lets keep it for now :)
     */
    let databaseitemamount = 0;

    //this is global boolean ready check if 0 database hasn't loaded if 1 database is loaded and ready
    /**
     * [databasestatus]
     * false means the items from the database has not loaded into the "select" list of items
     * true means the items from the database has loaded into the "select" list of items
     */
    var databasestatus = false;

    /**
     * [addchecker] - "CURRENT NOT USED BUT WILL LEAVE"
     * instantiated addchecker[0] (only using addchecker[0])
     * addchecker[0] is used as boolean checker
     * when addchecker[0] is false (in edit mode) you cannot add item
     * when addchecker[1] is true (out of edit mode) you can add item
     */
    var addchecker = [];
    addchecker[0] = true;

    /**
     * [namechecker]
     * instantiated namechecker[0] (only using namechecker[0])
     * namechecker[0] is used as boolean checker
     * when namechecker[0] is true (in edit mode) you cannot change item list name
     * when namechecker[1] is false (out of edit mode) you can change item list name
     */
    var namechecker = [];
    namechecker[0] = false;

    //this is global array that holds the increments and decrements for item quantity
    /**
     * [quantityholder]
     * holds each item's quanitity in this array
     * gives access to be incremented and decremented
     */
    var quantityholder = [];

    //item list page click add button to list the inputted Item Weight Quantity
    /**
     * [id]
     * holds counts for id's of the id name tags which are used to dynamically append, create lists, etc
     */
    let id = 0;

    /**
     * [validshopping]
     * when valid shopping is 0 you save button shows up (turns grey)
     * when valid shopping is 1 go shopping button shows up (turns green)
     */
    var validshopping = 0;

    /**
     * [selectlistcounter]
     * used to make sure that the select item list will only load once to the 
     * item scroll down
     * if selectlistcounter is false it should not execute [LOADS ITEMS SELECT LIST FOR NORMAL MODE & DOOMSDAY MODE]
     */
    var selectlistcounter = true;

    //||******************************************************||
    //||******************************************************||
    //||********************DATABASE CODE*********************||
    //||******************************************************||
    //||******************************************************||

    /**
     * [PREBUILDS THE SAVED ITEMS LIST] - (credits to Sean Green)
     * The code below is for the saved items list from the main page
     * when the user clicks the saved list this code activates
     * The code rebuilds a list based off of the list and its items from database
     */
    firebase.auth().onAuthStateChanged(function (user) {
        //use the users ID to access their file
        db.doc("Users/" + user.uid).get().then(function (userDoc) {
            // set user current shopping list
            var shoppingList = userDoc.get("shoppingList");
            //if the item list name is empty
            if (userDoc.get("shoppingList") === '') {
                //message used to debug
                console.log("row row row the boat");
                //else there is an item list name
            } else {
                db.collection('Users/' + user.uid + '/' + shoppingList).get().then(userList => {
                    //turns the documents into an array
                    let item = userList.docs;
                    saveliststatus = true;
                    savelistname = shoppingList;
                    $("#listname2span").html(shoppingList);

                    // loop through the array and add an <li> item for each item
                    for (i = 0; i < item.length; i++) {
                        //item name
                        let content = $('#listarea1').html();
                        let p = "<li class='customListStyle' id=magicitem" + id + "> <span id=removeid" + id + " class=removebutton>&#10060;&nbsp;</span>" + item[i].get("name") + "</li>";
                        $('#listarea1').html(content + p);
                        $('#magicitem' + id).appendTo("#listarea1");
                        //item weight (we removed it you wont be able to see it - display:none)
                        content = $('#listarea2').html();
                        let theweight = item[i].get("size") + " " + item[i].get("units");
                        p = "<li class='customListStyle' id=weightmagic" + id + ">" + theweight + "</li>";
                        $('#listarea2').html(content + p);
                        $('#weightmagic' + id).appendTo("#listarea2");
                        //item quantity
                        content = $('#listarea3').html();
                        p = "<li class='customListStyle' id=quantitymagic" + id + "><span id=minus" + id + " class=decrementbutton>&#9664;&nbsp;&nbsp;</span>" + item[i].get("qty") +
                            "<span id=plus" + id + "  class=incrementbutton>&nbsp;&nbsp;&#9654;</span></li>";
                        $('#listarea3').html(content + p);
                        $('#quantitymagic' + id).appendTo('#listarea3');
                        quantityholder.push(item[i].get("qty"));
                        id++
                    }
                });
            }
        });
    });

    /**
     * [LOADS ITEMS SELECT LIST FOR NORMAL MODE & DOOMSDAY MODE] - (credits to Maha Rehal)
     * Takes the items from database and adds them to the selectable items column
     * if the doomsday button is activated, it will replace the normal items with the doomsday items
     */
    firebase.auth().onAuthStateChanged(function (user) {
        db.doc("Users/" + user.uid).onSnapshot((snapshot) => {
            let path = "Items";
            if (snapshot.get("DoomsDayMode")) {
                path = "Doomsday";
            }
            db.collection(path).get().then((snapshot) => {
                //first time loading select list "selectlistcount = true" and run this code
                if (selectlistcounter === true) {
                    snapshot.docs.forEach(doc => {
                        //changing this to false means this code will not run more than once
                        //which will prevent our select drop down list on our item column from doubling
                        selectlistcounter = false;
                        let listOfItems = '<option id=itemoption value="' + doc.get("name") + '">' + doc.get("name") + '</option>'
                        $("#inputItem").append(listOfItems);
                        //adds database items name, size , and units in the following arrays to have access to it easier
                        namearray.push(doc.get("name"));
                        sizearray.push(doc.get("size"));
                        unitarray.push(doc.get("units"));
                        databaseitemamount++;
                        databasestatus = true;
                    })
                }
            })
        })
    })

    //||******************************************************||
    //||******************************************************||
    //||******************CLICK FUNCTION CODE*****************||
    //||******************************************************||
    //||******************************************************||


    /**
     * [ADD BUTTON CLICK FUNCTION]
     * adds unique item in item list
     * increments non-unique item in itemlist
     * everytime add is pressed it resets the go shop button to require list to be saved
     */
    $('#theaddbutton').on('click', function () {
        //instantiate a variable to hold the [id] of the item if for a double of the item when it runs through
        //the forloop to check the item list [note: ignore the -1 it means nothing]
        let trueidposition = -1;
        //instantiate a variable to check if an item is a copy [true], not a copy [false]
        let uniquecheck = false;
        //the user input number for quantity so that we know how many times to increment the double item
        let userinputquantity = $('#inputQuantity').val();
        //if the input box has no input assume increment by 1
        if (userinputquantity == '') {
            userinputquantity = 1;
        }
        //do the following code if there is an item in the item list, if empty list ignore
        if (id > 0) {
            let selecteditem = $('#inputItem').val();
            //for loop is used to get access through different id's of the item name
            for (let position2 = 0; position2 <= id; position2++) {
                let currentitemlist = $("#magicitem" + position2).text().trim();
                currentitemlist = currentitemlist.substring(2);
                //checks if the selected item is a double or not from the current item list on the database
                if (selecteditem === currentitemlist) {
                    uniquecheck = true;
                    trueidposition = position2;
                }
            }
        }
        //if the item is a copy of something on the list run the following code that will
        //increment the quantity instead of adding an same item again on the item list
        if (uniquecheck === true) {
            //resets the go shopping button to require item list to be saved
            $("#containerforshopbutton").html('<a class="goshopbutton"><span id="goshopstatus1">[CLICK TO SAVE]</span><span id="goshopstatus2"> GO SHOP</span></a>')
            validshopping = 0;
            for (let repeat = 0; repeat < userinputquantity; repeat++) {
                //get the current value from the array quantityholder[id](global) which is created when we added the item
                var currentvalue1 = quantityholder[trueidposition];
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
            //else the item is a unique item, add button will add the new item to the list
        } else {
            $("#containerforshopbutton").html('<a class="goshopbutton"><span id="goshopstatus1">[CLICK TO SAVE]</span><span id="goshopstatus2"> GO SHOP</span></a>')
            validshopping = 0;
            //if maha's code is fully loaded then run the following code
            if (databasestatus == true) {
                //this else statement will run and add a new item to the item list which means it has checked
                //the item list and this is an unique item
                let content = $('#listarea1').html();
                let itemname = $('#inputItem').val();
                if (!$('#inputItem').val()) {
                    itemname = "Empty";
                }
                let p = "<li class='customListStyle' id=magicitem" + id + "> <span id=removeid" + id + " class=removebutton>&#10060;&nbsp;</span>" + itemname + "</li>";
                $('#listarea1').html(content + p);
                $('#magicitem' + id).appendTo("#listarea1");

                //[FOR ITEM WEIGHT - DISCONTINUED - (we left this here but we have display:none)]
                //declare and instantiate local variable for weight 
                let position = 0;
                let weight = "";
                //passing the global name size and unit array into these local array to be able to use without error
                let namearray2 = namearray;
                let sizearray2 = sizearray;
                let unitarray2 = unitarray;
                for (position = 0; position < namearray2.length; position++) {
                    if (namearray2[position] === itemname) {
                        weight = weight + " " + sizearray2[position] + " " + unitarray2[position];
                    }
                }
                content = $('#listarea2').html();
                if (validshopping === 1) {
                    //debug purpose
                    console.log("yolo valid shopping is 1");
                } else if (validshopping === 0) {
                    p = "<li class='customListStyle' id=weightmagic" + id + ">" + weight + "</li>";
                    $('#listarea2').html(content + p);
                    $('#weightmagic' + id).appendTo("#listarea2");
                }
                //item quantity
                content = $('#listarea3').html();
                itemname = $('#inputQuantity').val();
                if (!$('#inputQuantity').val()) {
                    itemname = 1
                }
                p = "<li class='customListStyle' id=quantitymagic" + id + "><span id=minus" + id + " class=decrementbutton>&#9664;&nbsp;&nbsp;</span>" + itemname +
                    "<span id=plus" + id + "  class=incrementbutton>&nbsp;&nbsp;&#9654;</span></li>";
                $('#listarea3').html(content + p);
                $('#quantitymagic' + id).appendTo('#listarea3');
                quantityholder.push(itemname);
                id++;
            }
        }
    })


    /**
     * [EDIT BUTTON CLICK FUNCTION]
     * when edit button is clicked it will change item list name into a text box
     * edit button will become done button
     * if textbox is empty it and you press done it will use the old list name
     * if you input a new list name into the textbox it will replace it with the new when you press done
     */
    $(document).on('click', ".editbutton", function () {
        //used to compliment the class name, no other purpose
        let one = 1;
        //before you replace the content of the span list name save the name
        //when edit is clicked old name is saved in array[0]
        array[0] = $("#listname2").text();
        //replace the default list name with a textbox for user input
        $("#listname2span").html('<input type="text" id="newlistname" size="7" placeholder="List Name">')
        let content = $('#listname3').html();
        //put the done button into a variable
        let a = "<div><button class=editbutton" + one + ">DONE</button></div>";
        //use the done button variable, replace the edit button with done button
        $('#listname3').html(content + a);
        //remove the edit button
        $('.editbutton').remove();
        //set add checker back to false to prevent adds (not applicable anymore)
        addchecker[0] = false;
    })

    /**
     * [ITEM LIST TEXTBOX CLICK FUNCTION]
     * once the user presses the edit button and the textbox appears
     * if you press the textbox it will change namechecker[0] to true
     * which will replace the itemlist with what is inside the textbox
     * if you leave the textbox untouch after user clicks edit, it will
     * use the old list name once you click done
     */
    $(document).on('click', "#newlistname", function () {
        namechecker[0] = true;
    })

    /**
     * [DONE BUTTON CLICK FUNCTION]
     * when you press done, it will reset the go shopping button to require user to save list again
     * when you press done, if you clicked on the textbox before that it will replace the item list name 
     * with the new inputed name
     * when you press done, if you did not touch the textbox, the item list name will use the old name
     */
    $(document).on('click', ".editbutton1", function () {
        //when you press done it will require you to save the item list page again
        $("#containerforshopbutton").html('<a class="goshopbutton"><span id="goshopstatus1">[CLICK TO SAVE]</span><span id="goshopstatus2"> GO SHOP</span></a>')
        validshopping = 0;
        //change item list name with new input name
        if (namechecker[0] === true) {
            let userinput = $('#newlistname').val();
            $("#listname2span").html(userinput);
            $('#newlistname').remove();
            //item list name will remain the same as old item list name
        } else {
            $("#listname2span").html(array[0]);
            $('#newlistname').remove();
        }
        //delete the done button and replace with edit button
        $('.editbutton1').remove();
        $("#editbuttondiv").html("<button class=editbutton>EDIT</button>");
        $(".editbutton").addClass("button");
        array[0] = $("#listname2").text();
        //set add checker back to true to allow adds
        addchecker[0] = true;
        namechecker[0] = false;
    })

    /**
     * [REMOVE BUTTON(X button) CLICK FUNCTION]
     * when you click the x button reset the go shopping button to require user to save list
     * clicking the x button will remove the respective row of the item from the item list and the database
     */
    //function that removes the whole line of item on the item list page
    $(document).on('click', ".removebutton", function () {
        //require user to save list again
        $("#containerforshopbutton").html('<a class="goshopbutton"><span id="goshopstatus1">[CLICK TO SAVE]</span><span id="goshopstatus2"> GO SHOP</span></a>')
        validshopping = 0;
        //gets the id number of the clicked item
        let clickedid = $(this).attr('id').replace(/button/, '');
        let tempid = "";
        let position = 0;
        //loop through to dynamically change the id number which will be used to remove the items in the selected row
        for (position = 0; position < clickedid.length; position++) {
            if (clickedid[position] >= '0' && clickedid[position] <= 9) {
                tempid = tempid + clickedid[position];
            }
        }
        //remove item name
        $("#magicitem" + tempid).remove();
        //remove item weight - [NOTE] - display:none so you will not find this
        $("#weightmagic" + tempid).remove();
        //remove item quantity
        $("#quantitymagic" + tempid).remove();
    })

    /**
     * [INCREMENT BUTTON (Up Arrow button) CLICK FUNCTION]
     * when clicked it will increase the quantity of the item
     * once pressed it will reset the go shopping button to require user to save item list
     */
    //function that increments our quantity item.
    $(document).on('click', ".incrementbutton", function () {
        //reset to require user to save list again
        $("#containerforshopbutton").html('<a class="goshopbutton"><span id="goshopstatus1">[CLICK TO SAVE]</span><span id="goshopstatus2"> GO SHOP</span></a>')
        validshopping = 0;
        //Obtains the ID number based from the idname you clicked
        let clickedid = $(this).attr('id').replace(/button/, '');
        let tempid = "";
        let position = 0;
        for (position = 0; position < clickedid.length; position++) {
            if (clickedid[position] >= '0' && clickedid[position] <= 9) {
                tempid = tempid + clickedid[position];
            }
        }
        //get the current value from the array quantityholder[id](global) which is created when we added the item
        var currentvalue = quantityholder[tempid];
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

    /**
     * [DECREMENT BUTTON (Down Arrow button) CLICK FUNCTION]
     * when clicked it will decrease the quantity of the item
     * once pressed it will reset the go shopping button to require user to save item list
     */
    //function that decrement our quantity item.
    $(document).on('click', ".decrementbutton", function () {
        $("#containerforshopbutton").html('<a class="goshopbutton"><span id="goshopstatus1">[CLICK TO SAVE]</span><span id="goshopstatus2"> GO SHOP</span></a>')
        validshopping = 0;
        //Obtains the ID number based from the idname you clicked
        let clickedid = $(this).attr('id').replace(/button/, '');
        let tempid = "";
        let position = 0;
        for (position = 0; position < clickedid.length; position++) {
            if (clickedid[position] >= '0' && clickedid[position] <= 9) {
                tempid = tempid + clickedid[position];
            }
        }
        //get the current value from the array quantityholder[id](global) which is created when we added the item
        var currentvalue = quantityholder[tempid];
        //Only if current value is 0 which means it is the first time incrementing, we will grab the 
        //quantity information using jquery for the source code
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

    /**
     * [GO SHOP/SAVE LIST BUTTON CLICK FUNCTION]
     * Clicking toggles from save list button to the go shop button
     * (SAVELIST MODE)
     * when clicked it writes item name, item quantity and item weight to the database
     * once saved it the button will turn into the go shop button
     * (GO SHOP MODE)
     * when clicked it will take you to the "stores page"
     * (GO SHOP MODE - OTHER SCENARIO)
     * if in "GO SHOP MODE" clicking the add item, edit -> done, increment, decrement button will change
     * back to "SAVELIST MODE" which will require the user to save list again in order to resume back
     * into "GO SHOP MODE"
     */
    $(document).on('click', ".goshopbutton", function () {
        //if go shopping button is in save list mode
        if (validshopping === 0) {
            //if not using saved list use the name in the input textbox
            let listname = $('#listname2span').text();
            //if saveliststatus is true means you are in a saved list
            //use the item list name from the saved list
            if (saveliststatus === true) {
                listname = savelistname;
                saveliststatus = false;
            }
            //delete old list of items within the database
            deleteListByName(listname);
            //add the new list of items to the database
            setTimeout(() => {
                let betaitem;
                let item;
                let betaquantity;
                let quantity;
                let check;
                for (let position = 0; position <= id; position++) {
                    check = $("#magicitem" + position).text()
                    if (check !== '') {
                        betaitem = $("#magicitem" + position).text().trim();
                        betaquantity = $("#quantitymagic" + position).text().trim();
                        quantity = betaquantity.substring(3, betaquantity.length - 3);
                        item = betaitem.substring(2);
                        saveItemToList(item, $('#listname2span').text(), quantity);
                    }
                }
                //add current item list name as the shopping list name within the database
                setShoppingList($('#listname2span').text());
                //setting validshopping to 1 will make it so that the next time they click go shop button it will not run the code here
                validshopping = 1;
                //change button to go shopping mode
                $("#containerforshopbutton").html('<a class="goshopbutton" href="store_page.html"><span id="goshopstatus3">[READY]</span><span id="goshopstatus4"> GO SHOP</span></a>')
                //added basic hover css on the go shopping button
                $(".goshopbutton").hover(function () {
                    $(this).css("background-color", "rgb(84, 218, 66)");
                }, function () {
                    $(this).css("background-color", "white");
                });
                $(".goshopbutton").css("color", "green");
                //added alert to prompt the user that they have successfully saved their list to database
                alert('LIST SAVED! CLICK AGAIN TO SHOP');
            }, 1000);
        }
    });

    //||******************************************************||
    //||******************************************************||
    //||******************OTHER KINDS OF CODE*****************||
    //||******************************************************||
    //||******************************************************||

    /**
     * [setShoppingList FUNCTION]
     * gives a item list in the database a shoppingList name
     */
    function setShoppingList(listName) {
        firebase.auth().onAuthStateChanged(function (user) {
            let shopListName = listName;
            db.doc("Users/" + user.uid).set({
                shoppingList: shopListName
            }, {
                merge: true
            })
        })
    }

    /**
     * [class: theinput (CSS CHANGE)]
     * make the border in our textbox for the item list name a bit rounder
     */
    $('.theinput').css('border-radius', '3px');

    /**
     * [window.on("load")]
     * Normally this will fadeout the loading page when the window is fully loaded
     * but because the loading page went by too quickly I have to add a delay function
     */
    $(window).on("load", function () {
        delay(function () {
            $("#loader").fadeOut("slow");
        }, 5000);
    });

    /**
     * [delay FUNCTION]
     * delays anything done within it, 1000 = 1 second
     * credit: CMS
     * link: https://stackoverflow.com/questions/1909441/how-to-delay-the-keyup-handler-until-the-user-stops-typing
     */
    var delay = (function () {
        var timer = 0;
        return function (callback, ms) {
            clearTimeout(timer);
            timer = setTimeout(callback, ms);
        };
    })();
});