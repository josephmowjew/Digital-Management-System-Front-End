class AuthHandler {
    constructor(host, front_end_url) {
        this.host = host;
        this.front_end_url = front_end_url;
        this.spinner = document.getElementById("spinner");

        this.init();
    }

    init() {
        //this.hideSpinner();

        const resetPasswordBtn = document.getElementById("reset_password_btn");
        if (resetPasswordBtn) {
            resetPasswordBtn.addEventListener("click", () => this.resetPassword());
        }
    
        const forgotPasswordBtn = document.getElementById("forgot_password_btn");
        if (forgotPasswordBtn) {
            forgotPasswordBtn.addEventListener("click", () => this.forgotPassword());
        }

        const changePasswordBtn = document.getElementById("change_password_btn");
        if (changePasswordBtn) {
            changePasswordBtn.addEventListener("click", () => this.changePassword());
        }
    }

    showSpinner() {
        if (this.spinner) {
            this.spinner.style.display = 'block';
        } else {
            console.error('Spinner element with id "spinner" was not found');
        }
    }

    hideSpinner() {
        if (this.spinner) {
            this.spinner.style.display = 'none';
        } else {
            console.error('Spinner element with id "spinner" was not found');
        }
    }

    async resetPassword() {
        const form = document.querySelector("#resetPasswordForm");
        if (!form) {
            console.error("Reset password form not found");
            return;
        }

        const formData = new FormData(form);
        const password = formData.get("Password");

        // Validate password
        if (!this.validatePassword(password)) {
            toastr.error("Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.");
            return;
        }
    
        //const formData = new FormData(form);
    
        // Convert FormData to JSON
        const plainFormData = Object.fromEntries(formData.entries());
        const formDataJsonString = JSON.stringify(plainFormData);
    
        try {
            const response = await fetch(`${this.host}/api/auth/PasswordReset`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: formDataJsonString
            });
    
            const data = await response.text(); // Parse the response as JSON
    
            this.handleResponse(data, "#resetPasswordForm", this.resetPassword.bind(this));
        } catch (error) {
            //console.error(`Error: ${error}`);
        }
    }
    
    validatePassword(password) {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        return passwordRegex.test(password);
    }
    
    async changePassword() {
        const form = document.querySelector("#changePasswordForm")
        if (!form) {
            console.error("Change password form not found")
            return
        }

        console.log(form)

        const formData = new FormData(form);
        console.log("FormData entries:", Array.from(formData.entries()));

        // Convert FormData to JSON
        const plainFormData = Object.fromEntries(formData.entries())
        const formDataJsonString = JSON.stringify(plainFormData)

        try {
            this.showSpinner()
            const response = await fetch(`${this.host}/api/auth/ChangePassword`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: formDataJsonString
            })

            const data = await response.text()

            this.handleResponse(data, "#changePasswordForm", this.changePassword.bind(this))
        } catch (error) {
            console.error(`Error: ${error}`)
        }
    }



    async forgotPassword() {
        const form = document.querySelector("#forgot_password_form");
        if (!form) {
            console.error("Forgot password form not found");
            return;
        }

       
        const formData = new FormData(form);

        try {
            const response = await fetch(`${this.host}/api/auth/ForgotPassword`, {
                method: 'POST',
                body: formData
            });

            const data = await response.text();
            this.handleResponse(data, "#forgot_password_form", this.forgotPassword.bind(this));
        } catch (error) {
            console.error(`Error: ${error}`);
        }
    }


    handleResponse(data, formSelector, retryFunction) {

       //parse the data coming to json
        data = JSON.parse(data);

        // Check if data has the expected properties
        if (data.hasOwnProperty('isSuccess') && data.hasOwnProperty('message')) {
            if (data.isSuccess) {
                toastr.success(data.message);

                //redirect to the login page
                setTimeout(() => {
                    window.location.href = `${this.front_end_url}`;
                }, 3000);
            } else {
                toastr.error(data.message);
                //window.location.reload();
            }
        } else {
            // Handle the case where data does not have the expected properties
            toastr.error(data.message);
        }  
    }

    rewireFormEvents(formSelector, retryFunction) {
        document.querySelector(`${formSelector} button`).addEventListener("click", retryFunction);
        const form = document.querySelector(formSelector);
        $(form).removeData("validator");
        $(form).removeData("unobtrusiveValidation");
        $.validator.unobtrusive.parse(form);
    }
}

// Initialize the handler when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
   
    new AuthHandler(host,front_end_url);
});
