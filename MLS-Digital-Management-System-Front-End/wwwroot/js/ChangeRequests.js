$(function () {

    hideSpinner();

})

// Function to start the spinner
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

function Approve(id, token) {

    bootbox.confirm("Are you sure you want to approve this change request?", function (result) {

        console.log(token)
        if (result) {
            $.ajax({
                url: `${host}/api/ApplicationUserChangeRequest/approve/` + id,
                type: 'GET',
                headers: {
                    'Authorization': "Bearer " + token
                }

            }).done(function (data) {


                toastr.success("Change request approved sucessfully")

                datatable.ajax.reload();


            }).fail(function (response) {

                toastr.error("failed to approve change request")

                datatable.ajax.reload();
            });
        }


    });
}
function DenyForm(id, token) {
    bootbox.confirm("Are you sure you want to deny this change request?", function (result) {

        console.log(token)
        if (result) {
            $.ajax({
                url: `${host}/api/ApplicationUserChangeRequest/denyChangeRequest/` + id,
                type: 'GET',
                headers: {
                    'Authorization': "Bearer " + token
                }

            }).done(function (data) {


                toastr.success("Change request denied sucessfully")

                datatable.ajax.reload();


            }).fail(function (response) {

                toastr.error("failed to deny change request")

                datatable.ajax.reload();
            });
        }


    });
}