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
        console.log("item is" + itemname);

        content =$('#listarea2').html();
        itemname = $('#inputWeight').val();
        if( !$('#inputWeight').val()){
            itemname = "Empty"
        }
        p = "<li id=weightmagic" + id + ">" + itemname + "</li>";
        $('#listarea2').html(content + p);
        $('#input2').appendTo('#weightmagic' + id);
        console.log("weight is" + itemname);
        

        content =$('#listarea3').html();
        itemname = $('#inputQuantity').val();
        if( !$('#inputQuantity').val()){
            itemname = "Empty"
        }
        p = "<li id=quantitymagic" + id + ">" + itemname + "</li>";
        $('#listarea3').html(content + p);
        $('#input3').appendTo('#quantitymagic' + id);
        console.log("quantity is" + itemname);
        
        id++;
    })

    
});