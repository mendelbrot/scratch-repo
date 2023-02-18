import { LightningElement, api } from "lwc";
import { NavigationMixin } from "lightning/navigation";
import matchEmailToContact from "@salesforce/apex/SuggestedLeadsUtility.matchEmailToContact";
import matchEmailToLead from "@salesforce/apex/SuggestedLeadsUtility.matchEmailToLead";
import { ShowToastEvent } from "lightning/platformShowToastEvent";

export default class ListLeadContactMatches extends NavigationMixin(
  LightningElement
) {
  @api rowData;
  @api leadOrContact;
  @api searchResults;

  get areLeads() {
    return this.leadOrContact === "Lead";
  }

  get areContacts() {
    return this.leadOrContact === "Contact";
  }

  get areResults() {
    return !!this.searchResults && this.searchResults.length > 0;
  }

  // this was necessary due to danger + errors from getting deeply nested
  // properties like result.Account.Name in the html template
  get formattedSearchResults() {
    if (this.leadOrContact === "Lead") {
      return this.searchResults;
    }

    return this.searchResults.map((item) => {
      return {
        ...item,
        AccountName: item?.Account?.Name
      };
    });
  }

  handleNavToRecord(event) {
    try {
      event.stopPropagation();
      console.log("nav to: " + event.target.name);
      this[NavigationMixin.GenerateUrl]({
        type: "standard__recordPage",
        attributes: {
          recordId: event.target.name,
          actionName: "view"
        }
      }).then((url) => {
        window.open(url);
      });
    } catch (error) {
      console.log("error navigating to record");
      console.log(error);
      this.dispatchEvent(
        new ShowToastEvent({
          variant: "error",
          message: "Error navigating to record."
        })
      );
    }
  }

  async handleMatch(event) {
    try {
      event.stopPropagation();
      let recordId = event.target.name;
      let email = this.rowData._id;
      console.log("match " + email + " to " + recordId);
      let result;
      // event for the details parent component
      this.dispatchEvent(
        new CustomEvent("showspinner", {
          bubbles: true,
          composed: true
        })
      );
      switch (this.leadOrContact) {
        case "Lead":
          result = await matchEmailToLead({
            email: email,
            recordId: recordId
          });
          // event for the details parent component
          this.dispatchEvent(
            new CustomEvent("hidespinner", {
              bubbles: true,
              composed: true
            })
          );
          break;
        case "Contact":
          result = await matchEmailToContact({
            email: email,
            recordId: recordId
          });
          // event for the details parent component
          this.dispatchEvent(
            new CustomEvent("hidespinner", {
              bubbles: true,
              composed: true
            })
          );
          break;
        default:
          throw (
            "Could not perform match: record type not recognized: " +
            this.leadOrContact
          );
      }
      switch (result) {
        case "success":
          let recordData = this.searchResults.find(
            (element) => element.Id === recordId
          );
          this.dispatchEvent(
            new CustomEvent("match", {
              bubbles: true,
              composed: true,
              // here i'm mimicking the format of a successful record creation form event.
              // this is to be able to reuse the logic in the handleAfterAdd function in suggestedLeads.js.
              detail: {
                id: recordId,
                apiName: this.leadOrContact,
                wasUpdated: true, // says that this was from updating a record and not from creating a new record
                fields: {
                  FirstName: {
                    value: recordData?.FirstName
                  },
                  LastName: {
                    value: recordData?.LastName
                  },
                  Email: {
                    value: this.rowData._id
                  }
                }
              }
            })
          );
          break;
        case "all_fields_taken":
          this.dispatchEvent(
            new ShowToastEvent({
              variant: "error",
              message:
                "This person already has two emails.  Please go to the record and replace one."
            })
          );
          break;
        default:
          throw "match result not understood: " + result;
      }
    } catch (error) {
      console.log("error matching email to record");
      console.log(error);
      // event for the details parent component
      this.dispatchEvent(
        new CustomEvent("hidespinner", {
          bubbles: true,
          composed: true
        })
      );
      this.dispatchEvent(
        new ShowToastEvent({
          variant: "error",
          message: "There was an error matching the email to the record."
        })
      );
    }
  }
}
