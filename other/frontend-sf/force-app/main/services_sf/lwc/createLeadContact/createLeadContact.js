import { LightningElement, api } from "lwc";
import { NavigationMixin } from "lightning/navigation";
import getUserInfo from "@salesforce/apex/UserDetails.getUserInfo";
import { ShowToastEvent } from "lightning/platformShowToastEvent";

export default class CreateLeadContact extends NavigationMixin(
  LightningElement
) {
  @api rowData;
  userInfo;
  submitInProgress;

  /*
  reset form is not used due to causing bugs and worse user experience.

  this is the problem it was trying to solve:

  lightning-record-edit-form: if the new value to populate in the field is empty or null, 
  and if you have previously typed something in the field, then the field will not be cleared 
  when switching to a new record.

  I was not able to solve the above problem.
  */
  @api resetForm() {
    try {
      console.log("resetForm");
      const inputFields = this.template.querySelectorAll(
        "lightning-input-field"
      );
      if (inputFields) {
        inputFields.forEach((field) => {
          field.reset();
        });
      }
    } catch (error) {
      console.log("Error resetting the create form.");
      console.log(error);
      this.dispatchEvent(
        new ShowToastEvent({
          variant: "error",
          message: "Error resetting the create form."
        })
      );
    }
  }

  // getter functions to make it easier for the details view to tell if it's dealing with a lead or contact
  get isLead() {
    return this.rowData && this.rowData.actionName == "Lead";
  }
  get isContact() {
    return this.rowData && this.rowData.actionName == "Contact";
  }

  // getters for default form values
  get name() {
    try {
      let name = this.userInfo.Name;
      return name;
    } catch (error) {
      //there is always an error here on first render (before renderedCallback)
      // console.log("name error");
      // console.log(error);
    }
  }

  get date() {
    try {
      let date = new Date(this.rowData.last_contact_date);
      return date.toISOString();
    } catch (error) {
      console.log("date error");
      console.log(error);
    }
  }

  renderedCallback() {
    getUserInfo()
      .then((info) => {
        this.userInfo = info;
      })
      .catch((error) => {
        console.log("user info error");
        console.log(error);
      });
  }

  // grab the messages from the error event and transmit a new event the parent component
  handleFormError(error) {
    try {
      console.log("form error");
      // event for the details parent component
      this.dispatchEvent(
        new CustomEvent("hidespinner", {
          bubbles: true,
          composed: true
        })
      );
      let message = "There was an error submitting the form.";
      try {
        message = error.detail.message;
      } catch (e) {}

      // add the error messages from the individual fields.  Fore example, one looks like this:
      // console.log(error.detail.output.fieldErrors.Lead_Generator__c[0].message);
      // console.log(Object.assign({}, error.detail.output));
      try {
        let fieldErrors = Object.assign({}, error.detail.output.fieldErrors);
        Object.values(fieldErrors).forEach((fieldError) => {
          message += "\n" + fieldError[0].message;
        });
      } catch (e) {}
      try {
        let errors = error.detail.output.errors;
        errors.forEach((error) => {
          message += "\n" + error.message;
        });
      } catch (e) {}

      // send the event up the the suggestedLeads component, handled ny onmessage
      this.dispatchEvent(
        new CustomEvent("message", {
          bubbles: true,
          composed: true,
          detail: { value: message }
        })
      );
    } catch (error) {
      console.log("There was an error submitting the form.");
      console.log(error);
      this.dispatchEvent(
        new ShowToastEvent({
          variant: "error",
          message: "There was an error submitting the form."
        })
      );
    }
  }

  handleFormSubmit() {
    this.dispatchEvent(
      // event for the details parent component
      new CustomEvent("showspinner", {
        bubbles: true,
        composed: true
      })
    );
  }

  // this is also handled in
  handleFormSuccess() {
    // event for the details parent component
    this.dispatchEvent(
      new CustomEvent("hidespinner", {
        bubbles: true,
        composed: true
      })
    );
  }
}
