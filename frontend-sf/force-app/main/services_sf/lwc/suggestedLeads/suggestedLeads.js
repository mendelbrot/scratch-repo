import { LightningElement } from "lwc";
import getSuggestedLeads from "@salesforce/apex/suggestedLeadsCaller.getSuggestedLeads";
import removeSuggestedLead from "@salesforce/apex/suggestedLeadsCaller.removeSuggestedLead";
import addExcludedEmails from "@salesforce/apex/suggestedLeadsCaller.addExcludedEmails";
import { NavigationMixin } from "lightning/navigation";
import { ShowToastEvent } from "lightning/platformShowToastEvent";

const DEFAULT_RESULT_LIMIT = 25;

// the columns displayed in the suggested leads table (lightning-datatable)
const columns = [
  { label: "Email", fieldName: "_id", type: "text" },
  // { label: 'Title', fieldName: 'title', type: 'text' },
  { label: "First Name", fieldName: "first_name", type: "text" },
  { label: "Last Name", fieldName: "last_name", type: "text" },
  { label: "Company", fieldName: "company", type: "text" },
  {
    label: "Last Contact Date",
    fieldName: "last_contact_date",
    type: "date",
    typeAttributes: {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "2-digit"
    }
  },
  {
    type: "button",
    typeAttributes: {
      variant: "neutral",
      label: "Add Lead",
      name: "Lead"
    },
    fixedWidth: 109
  },
  {
    type: "button",
    typeAttributes: {
      variant: "neutral",
      label: "Add Contact",
      name: "Contact"
    },
    fixedWidth: 126
  },
  {
    type: "button",
    typeAttributes: {
      variant: "destructive-text",
      label: "X",
      name: "dismiss"
    },
    fixedWidth: 60
  }
];

export default class SuggestedLeads extends NavigationMixin(LightningElement) {
  loading = false; // if:true={loading} then disable inputs and display spinner
  message;
  data;
  rowData; // details data for the selected row
  searchValue = "";
  newRecord; // info about the last Lead/Contact that was added
  selectedRows; // rows that are selected with the checkboxes

  // the text that says if the most recent record was added or updated
  get addedOrUpdated() {
    return this.newRecord.wasUpdated === true ? "Updated" : "Added";
  }

  // getter that checks that selectedRows is not empty/null/undefined
  get areSelectedRows() {
    return !!this.selectedRows && !!this.selectedRows.length;
  }

  columns = columns; // lightning-datatable config

  // this is called in handleAfterAdd and handleAfterMatch event handlers.
  // this function processes the data in the event and uses the data to create the
  // newRecord object
  processAddOrMatchData(event) {
    let recordId = event.detail.id; // the id of the new lead/contact
    let apiName = event.detail.apiName; // Lead or Contact
    let wasUpdated = event.detail.wasUpdated; // true or undefined
    let fields = event.detail.fields;

    // console.log(Object.assign({}, fields))

    let newRecord = {
      recordId,
      apiName, // Lead or Contact
      FirstName: fields.FirstName && fields.FirstName.value,
      LastName: fields.LastName && fields.LastName.value,
      Email: fields.Email && fields.Email.value
    };

    // make wasUpdate true or false
    newRecord.wasUpdated = wasUpdated === true ? true : false;

    // add in the Name, event.detail.fields doesn't have this
    newRecord.Name = [newRecord.FirstName, newRecord.LastName]
      .filter((name) => !!name)
      .join(" ");

    return newRecord;
  }

  updateViewAndDatabaseAfterAddOrMatch(newRecord) {
    // update the view
    this.message = undefined;
    this.newRecord = newRecord;
    this.data = this.data.filter((item) => item._id != newRecord.Email);
    this.rowData = undefined;

    // remove the suggested lead from the backend
    removeSuggestedLead({ email: newRecord.Email });
  }

  // this callback gets called by the success event from the lightning-record-form
  // after lead/contact is successfully created
  handleAfterAdd(event) {
    try {
      let newRecord = this.processAddOrMatchData(event);
      this.updateViewAndDatabaseAfterAddOrMatch(newRecord);
    } catch (error) {
      console.log("error in handleAfterAdd");
      console.log(error);
      this.dispatchEvent(
        new ShowToastEvent({
          variant: "error",
          message: "Error in handling the record creation event."
        })
      );
    }
  }

  // after matching the email to an existing record
  handleAfterMatch(event) {
    try {
      let newRecord = this.processAddOrMatchData(event);
      this.updateViewAndDatabaseAfterAddOrMatch(newRecord);
    } catch (error) {
      console.log("error in handleAfterMatch");
      console.log(error);
      this.dispatchEvent(
        new ShowToastEvent({
          variant: "error",
          message: "Error in handling the email matched to record event."
        })
      );
    }
  }

  // display a message from the child component
  handleMessage(event) {
    try {
      this.message = event.detail.value;
      this.newRecord = undefined;
    } catch (error) {
      console.log("error handling message event");
      console.log(error);
      this.dispatchEvent(
        new ShowToastEvent({
          variant: "error",
          message: "Error in handling the message event."
        })
      );
    }
  }

  handleNavToRecord(event) {
    try {
      event.stopPropagation();
      console.log("nav to: " + this.newRecord.recordId);

      this[NavigationMixin.GenerateUrl]({
        type: "standard__recordPage",
        attributes: {
          recordId: this.newRecord.recordId,
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

  // this gets called after clicking any button in the table row
  // the button and row are identified by event.detail.action.name and event.detail.row
  // rowData is passed to the details component for the form on the side
  handleRowActions(event) {
    try {
      const {
        action: { name: action_name },
        row: row_data
      } = event.detail;
      console.log(action_name);
      switch (action_name) {
        case "Contact":
        case "Lead":
          if (row_data?._id != this.rowData?._id) {
            // only reset the search and accordian if navigating to a different row
            this.template
              .querySelector("c-suggested-lead-details")
              ?.resetActiveSection();
            this.template
              .querySelector("c-suggested-lead-details")
              ?.clearSearch();
          }
          // resetting the form is not used: causes bugs and a worse ux
          // this.template.querySelector('c-suggested-lead-details')?.resetForm()
          this.message = undefined;
          this.newRecord = undefined;
          this.rowData = Object.assign(
            {},
            {
              actionName: action_name,
              name: [row_data.first_name, row_data.last_name]
                .filter((name) => !!name)
                .join(" ")
            },
            row_data
          );
          this.searchValue = this.rowData.name;
          break;
        case "dismiss":
          let email = row_data._id;
          console.log("dismiss: " + email);
          this.data = this.data.filter((item) => item._id != email);
          addExcludedEmails({ emails: [email] });
          break;
        default:
          console.log("row action not recognized: " + action_name);
      }
    } catch (error) {
      console.log("error handling row action");
      console.log(error);
      this.dispatchEvent(
        new ShowToastEvent({
          variant: "error",
          message: "Error handling row action."
        })
      );
    }
  }

  // checkbox selecting rows for bulk delete
  handleRowSelection(event) {
    try {
      this.selectedRows = Array.from(event.detail.selectedRows); // again, I'm given a proxy, grrr
    } catch (error) {
      console.log("error handling row selection");
      console.log(error);
      this.dispatchEvent(
        new ShowToastEvent({
          variant: "error",
          message: "Error handling row selection."
        })
      );
    }
  }

  handleBulkDismiss() {
    try {
      if (this.selectedRows) {
        let dismissEmails = this.selectedRows.map((item) => item._id);
        console.log("dismiss: " + dismissEmails);
        this.data = this.data.filter(
          (item) => !dismissEmails.includes(item._id)
        );
        addExcludedEmails({ emails: dismissEmails });
      }
    } catch (error) {
      console.log("error handling bulk dismiss");
      console.log(error);
      this.dispatchEvent(
        new ShowToastEvent({
          variant: "error",
          message: "Error handling bulk dismiss."
        })
      );
    }
  }

  // get the data when the component is inserted into the DOM
  connectedCallback() {
    this.handleRefresh();
  }

  handleRefresh() {
    this.getData();
  }

  handleGetMore() {
    try {
      // get the last contact date of the last suggested lead in the list
      // divide it by 1000 to put it back in the seconds format of the backend
      let before_date = Math.floor(this.data.at(-1).last_contact_date / 1000);
      this.getData(true, before_date);
    } catch (error) {
      console.log("Error handling get more suggested leads");
      console.log(error);
      this.dispatchEvent(
        new ShowToastEvent({
          variant: "error",
          message: "Error handling get more suggested leads"
        })
      );
    }
  }

  // gets the suggested leads, changes variables:
  // loading
  // message
  // data
  getData(
    do_update = true,
    before_date = 0,
    result_limit = DEFAULT_RESULT_LIMIT
  ) {
    try {
      this.loading = true;
      this.message = undefined;
      this.newRecord = undefined;
      this.rowData = undefined;
      let params = {
        do_update: do_update ? "true" : "false",
        before_date: String(before_date),
        result_limit: String(result_limit)
      };
      getSuggestedLeads(params).then((result) => {
        result = JSON.parse(result);

        if (result.data) {
          this.data = result.data.map((item) => {
            // convert the last contact date from seconds to milliseconds for the lightning-datatable
            let dateMillis = item.last_contact_date * 1000;
            return {
              ...item,
              last_contact_date: dateMillis
            };
          });
        }

        if (result.error) {
          console.log(result.error);
          this.message = "Error getting data: " + result.error;
          this.dispatchEvent(
            new ShowToastEvent({
              variant: "error",
              message: "Error getting data"
            })
          );
        }

        if (!result.data && !result.error) {
          this.message = "No data returned";
          this.dispatchEvent(
            new ShowToastEvent({
              variant: "error",
              message: "No data returned"
            })
          );
        }

        this.loading = false;
      });
    } catch (error) {
      console.log("Error getting data: ");
      console.log(error);
      this.loading = false;
      this.message = "Error getting data: " + error;
      this.newRecord = undefined;
      this.rowData = undefined;
      this.dispatchEvent(
        new ShowToastEvent({
          variant: "error",
          message: "Error getting data"
        })
      );
    }
  }
}
