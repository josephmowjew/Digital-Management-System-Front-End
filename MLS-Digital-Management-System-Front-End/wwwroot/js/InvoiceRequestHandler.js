class AuthHandler {
  constructor(host) {
      this.host = host;
      this.spinner = document.getElementById("spinner");

      this.init();
  }

  init() {
      this.hideSpinner();
      document.getElementById("reset_password_btn").addEventListener("click", () => this.resetPassword());
      document.getElementById("forgot_password_btn").addEventListener("click", () => this.forgotPassword());
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
      const form = document.querySelector("#reset_password_form");
      const userInput = {
          __RequestVerificationToken: form.querySelector("input[name='__RequestVerificationToken']").value,
          Code: form.querySelector("input[name='Code']").value,
          Email: form.querySelector("input[name='Email']").value,
          Password: form.querySelector("input[name='Password']").value
      };

      console.log("User Input:", userInput);

      try {
          const response = await fetch(`${this.host}/api/auth/PasswordReset`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify(userInput)
          });

          const data = await response.text();
          this.handleResponse(data, "#reset_password_modal", this.resetPassword.bind(this));
      } catch (error) {
          console.error(`Error: ${error}`);
      }
  }

  async forgotPassword() {
      const form = document.querySelector("#forgot_password_form");
      const userInput = {
          __RequestVerificationToken: form.querySelector("input[name='__RequestVerificationToken']").value,
          Email: form.querySelector("input[name='Email']").value
      };

      try {
          const response = await fetch(`${this.host}/api/auth/ForgotPassword`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify(userInput)
          });

          const data = await response.text();
          this.handleResponse(data, "#forgot_password_form", this.forgotPassword.bind(this));
      } catch (error) {
          console.error(`Error: ${error}`);
      }
  }

  handleResponse(data, formSelector, retryFunction) {
      const parsedData = new DOMParser().parseFromString(data, 'text/html');
      const isInvalid = parsedData.querySelector("input[name='DataInvalid']")?.value === "true";

      if (isInvalid) {
          document.querySelector(formSelector).innerHTML = data;
          toastr.error(parsedData.querySelector("input[name='message']").value);
          this.rewireFormEvents(formSelector, retryFunction);
      } else {
          toastr.success(parsedData.querySelector("input[name='message']").value);
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
  
  new AuthHandler(host);
});
