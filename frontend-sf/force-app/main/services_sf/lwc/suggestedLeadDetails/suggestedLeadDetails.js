import { LightningElement, api } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";

export default class SuggestedLeadDetails extends LightningElement {
  @api rowData;
  @api searchValue;
  spinner = false;

  @api resetActiveSection() {
    try {
      console.log("resetActiveSection");
      const accordion = this.template.querySelector(".details-accordion");
      accordion.activeSectionName = "Search";
    } catch (error) {
      console.log("Error resetting accordion.");
      console.log(error);
      this.dispatchEvent(
        new ShowToastEvent({
          variant: "error",
          message: "Error resetting accordion."
        })
      );
    }
  }

  @api clearSearch() {
    this.template?.querySelector("c-search-lead-contact")?.clearSearch();
  }

  @api resetForm() {
    this.template?.querySelector("c-create-lead-contact")?.resetForm();
  }

  get titleForMatchSection() {
    let leadOrContact = this.rowData.actionName;
    return leadOrContact + " Matches";
  }

  get titleForCreateSection() {
    let leadOrContact = this.rowData.actionName;
    return "Create New " + leadOrContact;
  }

  handleShowSpinner(event) {
    event.stopPropagation();
    this.spinner = true;
  }

  handleHideSpinner(event) {
    event.stopPropagation();
    this.spinner = false;
  }
}
