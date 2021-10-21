$('input[id="send"]').click(function (e) {
    e.preventDefault();

    let publish = $('input[id="message-text"]').val()

    $.ajax({
        url: 'http://chat.api.loc/server.php',
        method: 'POST',
        data: {'publish': publish},
        success: function (data){
            console.log(data);
        },
        error: function ()
        {
            console.log('error');
        }
    });
    $(this).val('');
});