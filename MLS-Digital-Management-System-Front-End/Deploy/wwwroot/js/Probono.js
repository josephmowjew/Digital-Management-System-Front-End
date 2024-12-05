$(function () {

    hideSpinner();
    //hook up a click event to the login button

    //var createApplicationButton = $("#create_application_modal button[name='create_application_btn']").unbind().click(OnCreateClick);
})

function Delete(id, token) {
    bootbox.confirm("Are you sure you want to delete this pro bono case?", function (result) {


        if (result) {
            $.ajax({
                url: `${host}/api/probonos/${id}`,
                type: 'DELETE',
                headers: {
                    'Authorization': "Bearer " + token
                }

            }).done(function (data) {


                toastr.success("Pro bono case has been deleted sucessfully")

                datatable.ajax.reload();


            }).fail(function (response) {

                toastr.error(response.responseText)

                datatable.ajax.reload();
            });
        }


    });
}

function ApplyForCase(id, token){
    bootbox.confirm("Are you sure you want to apply to handle this case?", function (result) {
        if (result) {
            $.ajax({
                url: `${host}/api/probonos/applyForCase/${id}`,
                type: 'GET',
                headers: {
                    'Authorization': "Bearer " + token
                }

            }).done(function (data) {

                toastr.success("Your application has been sent sucessfully");

                datatable.ajax.reload();

            }).fail(function (response) {

                toastr.error(response.responseText)

                datatable.ajax.reload();
            });
        }

    });
}

// Function to start the spinner
function showSpinner() {

    var spinnerElement = document.getElementById('spinner');
    if(spinnerElement){
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



