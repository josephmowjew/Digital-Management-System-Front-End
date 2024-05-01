$(function () {

    hideSpinner();
    //hook up a click event to the reset button
    var reset_passwordButton = $("#reset_password_btn").unbind().click(ResetPassword);

    var forgot_passwordButton = $("#forgot_password_btn").unbind().click(ForgotPassword);
    })

    //reset password
function ResetPassword() {

    var code = $("#reset_password_form input[name='Code']").val()
    var email = $("#reset_password_form input[name='Email']").val();
    var password = $("#reset_password_form input[name='Password']").val();
    var authenticationToken = $("#reset_password_form input[name='__RequestVerificationToken']").val();
    var form_url = $("#reset_password_form form").attr("action");

    console.log("code", code, "email", email, "password", password)
    


    var userInput = {
        __RequestVerificationToken: authenticationToken,
        Code: code,
        Password: password,
        Email: email
    }



    $.ajax({
        url: "http://localhost:5043/api/auth/PasswordReset",
        type: 'POST',
        data: userInput,
        success: function (data) {


            //parse whatever comes back to html

            var parsedData = $.parseHTML(data)


            //check if there is an error in the data that is coming back from the user

            var isInvalid = $(parsedData).find("input[name='DataInvalid']").val() == "true"


            if (isInvalid == true) {

                //replace the form data with the data retrieved from the server
                $("#reset_password_modal").html(data)


                //rewire the onclick event on the form

                $("#reset_password_modal button[name='reset_password_btn']").unbind().click(function () { ResetPassword() });

                var form = $("#reset_password_modal")

                toastr.error(data.message)

                $(form).removeData("validator")
                $(form).removeData("unobtrusiveValidation")
                $.validator.unobtrusive.parse(form)


            }
            else {


                //show success message to the user

                toastr.success(data.message)



            }



        },
        error: function (xhr, ajaxOtions, thrownError) {

            console.error(thrownError + "r\n" + xhr.statusText + "r\n" + xhr.responseText)
        }

    });


}

// forgot password
function ForgotPassword() {

    var email = $("#forgot_password_form input[name='Email']").val();
    var authenticationToken = $("#forgot_password_form input[name='__RequestVerificationToken']").val();
    var form_url = $("#forgot_password_form form").attr("action");

    console.log(email, form_url)
   

    var userInput = {
        __RequestVerificationToken: authenticationToken,
        Email: email
    }



    $.ajax({
        url: "http://localhost:5043/api/auth/ForgotPassword",
        type: 'POST',
        data: userInput,
        success: function (data) {


            //parse whatever comes back to html

            var parsedData = $.parseHTML(data)


            //check if there is an error in the data that is coming back from the user

            var isInvalid = $(parsedData).find("input[name='DataInvalid']").val() == "true"


            if (isInvalid == true) {

                //replace the form data with the data retrieved from the server
                $("#forgot_password_form").html(data)


                //rewire the onclick event on the form

                $("#forgot_password_form button[name='forgot_password_btn']").unbind().click(function () { ForgotPassword() });

                toastr.error(data.message)

                var form = $("#forgot_password_form")

                $(form).removeData("validator")
                $(form).removeData("unobtrusiveValidation")
                $.validator.unobtrusive.parse(form)


            }
            else {

                toastr.success(data.message)

            }



        },
        error: function (xhr, ajaxOtions, thrownError) {

            console.error(thrownError + "r\n" + xhr.statusText + "r\n" + xhr.responseText)
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



