$(document).ready(function(){

    //item list page click add button to list the inputted Item Weight Quantity
    let id = 0;
    $('#theaddbutton').on('click', function() {
        let content =$('#listarea1').html();
        let itemname = $('#inputItem').val();
        if( !$('#inputItem').val()){
            itemname = "Empty";
        }
        let p = "<li id=magicitem" + id + ">" + itemname + "</li>";
        $('#listarea1').html(content + p);
        $('#input1').appendTo('#magicitem' + id);
        //console.log("item is" + itemname);

        content =$('#listarea2').html();
        itemname = $('#inputWeight').val();
        if( !$('#inputWeight').val()){
            itemname = "Empty"
        }
        p = "<li id=weightmagic" + id + ">" + itemname + "</li>";
        $('#listarea2').html(content + p);
        $('#input2').appendTo('#weightmagic' + id);
        //console.log("weight is" + itemname);
        

        content =$('#listarea3').html();
        itemname = $('#inputQuantity').val();
        if( !$('#inputQuantity').val()){
            itemname = "Empty"
        }
        p = "<li id=quantitymagic" + id + ">" + itemname + "</li>";
        $('#listarea3').html(content + p);
        $('#input3').appendTo('#quantitymagic' + id);
        //console.log("quantity is" + itemname);
        
        id++;
    })


    //adding basic css to the list items input boxes
    $('.theinput').css('border-radius', '3px');

    var array = [];
    array[0] = "null";
    

    //function when click the edit button for item list name
    // $('.editbutton').on('click', function() {
    $(document).on('click', ".editbutton", function() {
        let one = 1;
        let two = 2;
        //before you replace the content of the span list name save the name
        //when edit is clicked old name is saved in array check position 1
        array[0] = $("#listname2").text();
        //replace the default list name with a text box for user input
        $("#listname2span").html('<input type="text" id="newlistname" size="7" placeholder="List Name">')
        let content = $('#listname3').html();
        //prebuilt buttons for confirm (class="editbuttonone") and cancel (class="editbuttontwo") 
        let a = "<div><button class=editbutton" + one + ">CONFIRM</button></div>";
        let b = "<div><button class=editbutton" + two +">CANCEL</button></div>";
        //add the confirm button
        $('#listname3').html(content + a);
        //reinstantiate content for listname3 then add the cancel button to make it below
        content = $('#listname3').html();
        $('#listname3').html(content + b);
        //remove the edit button
        $('.editbutton').remove();
    })



    //function when click the confirm button for item list name
    //class added dynamically therefore use event delegation
    $(document).on('click', ".editbutton1", function() {
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
    })


    //function when click the cancel button for item list name
    $(document).on('click', ".editbutton2", function() {
        //reinput the saved string from array[0] as the title
        $("#listname2span").html(array[0]);
        //delete textbox
        $('#newlistname').remove();
        //delete confirm 
        $('.editbutton1').remove();
        //delete cancel
        $('.editbutton2').remove();
        //add edit button
        $("#editbuttondiv").html("<button class=editbutton>EDIT</button>");
        $(".editbutton").addClass("button"); 
    })

    // CSS ON BUTTONS NOT WORKING
    //css for confirm button (class editbutton1)
    // $('.editbutton1').css({
    //     'color': 'rgb(54, 132, 247)',
    //     'border': 'none',
    //     'background-color': 'inherit',
    //     'padding': '14px 28px',
    //     'font-size':'20px',
    //     'cursor': 'pointer',
    //     'display':'inline-block'
    // });

    // $('.editbutton1').hover(function(){
    //     $('.editbutton1').css('background-color', '#164AF2')
    // })

    // $('.editbutton1').addClass("button");


    //css for cancel button (class editbutton2)
});