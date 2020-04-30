$(document).ready(function(){

    //item list page click add button to list the inputted Item Weight Quantity
    let id = 0;
    $('#theaddbutton').on('click', function() {
        let content =$('#listarea1').html();
        let itemname = $('#inputItem').val();
        let p = "<li id=magicitem" + id + ">" + itemname + "</li>";
        $('#listarea1').html(content + p);
        $('#input1').appendTo('#magicitem' + id);

        content =$('#listarea2').html();
        itemname = $('#inputWeight').val();
        p = "<li id=weightmagic" + id + ">" + itemname + "</li>";
        $('#listarea2').html(content + p);
        $('#input2').appendTo('#weightmagic' + id);

        content =$('#listarea3').html();
        itemname = $('#inputQuantity').val();
        p = "<li id=quantitymagic" + id + ">" + itemname + "</li>";
        $('#listarea3').html(content + p);
        $('#input3').appendTo('#quantitymagic' + id);
        id++;
    })
});