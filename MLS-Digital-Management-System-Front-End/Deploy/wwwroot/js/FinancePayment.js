
this.hideSpinner();
function Activate(id, token) {

    bootbox.confirm("Are you sure you want to approve this payment?", function (result) {


        if (result) {

            showSpinner()
            $.ajax({
                url: `${host}/api/PenaltyPayments/approve/`+id,
                type: 'POST',
                headers: {
                    'Authorization': "Bearer " + token
                }

            }).done(function (data) {


                toastr.success("Payment has been approved sucessfully")

                datatable.ajax.reload();

                hideSpinner();


            }).fail(function (response) {

                hideSpinner();

                toastr.error("failed to approve payment")

                datatable.ajax.reload();
            });
        }


    });
}
function DenyForm(id, token) {


    //get the input field inside the edit role modal form

    $("#deny_penalty_payment_modal input[name ='PenaltyPaymentId']").val(id)

    //hook up an event to the update role button

    $("#deny_penalty_payment_modal button[name='deny_penalty_payment_btn']").unbind().click(function () { DenyApplication() })



    $("#deny_penalty_payment_modal").modal("show");
}


function DenyApplication() {

    showSpinner();

    toastr.clear()

    //send the request



    var form = $("#deny_penalty_payment_modal form")[0];

    // Create a new FormData object
    var formData = new FormData();

    // Append the form field values
    $(form).find('input, select, textarea').each(function (index, element) {
        var field = $(element);
        var fieldName = field.attr('name');
        var fieldValue = field.val();
        formData.append(fieldName, fieldValue);
    });


    //send the request

    $.ajax({
        url: `${host}/api/PenaltyPayments/denyPayment`,
        type: 'POST',
        data: formData, // Convert formData object to JSON string
        processData: false, // Set processData to false to prevent automatic serialization
        contentType: false, // Prevent jQuery from processing the data (since it's already in FormData format)
        headers: {
            'Authorization': "Bearer " + tokenValue
        },
        success: function (data) {


            hideSpinner();
            //show success message to the user
            var dataTable = $('#penaltyPayment_table').DataTable();

            toastr.success("Penalty Paymnet has been denied")

            $("#deny_penalty_payment_modal").modal("hide")

            dataTable.ajax.reload();

        },
        error: function (xhr, ajaxOtions, thrownError) {
            hideSpinner();
            var errorResponse = JSON.parse(xhr.responseText);
            $.each(errorResponse, function (key, value) {
                $.each(value, function (index, message) {

                    const elementName = key ? key.charAt(0).toUpperCase() + key.slice(1) : null;
                    const element = $("#deny_penalty_payment_modal").find("form :input[name='" + (elementName || '') + "']");

                    if (element && element.length) {
                        element.siblings("span.text-danger").text(message);
                    }

                });
            });
        }

    });


}


function showSpinner() {

    var spinnerElement = document.getElementById('spinner');
    if (spinnerElement) {
        spinnerElement.style.display = 'block';
    } else {
        console.error('Spinner element with id "spinner" was not found');
    }

}

// Function to stop the spinner
function hideSpinner() {

    var spinnerElement = document.getElementById('spinner');
    if (spinnerElement) {
        spinnerElement.style.display = 'none';
    } else {
        console.error('Spinner element with id "spinner" was not found');
    }
}