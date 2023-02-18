import { LightningElement, api, track } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import contactSearch from "@salesforce/apex/SuggestedLeadsUtility.contactSearch";
import leadSearch from "@salesforce/apex/SuggestedLeadsUtility.leadSearch";

export default class SearchLeadContact extends LightningElement {
  @api rowData;
  @api searchValue;
  leadSearchResults;
  contactSearchResults;

  @api clearSearch() {
    try {
      console.log("clearSearch");
      this.searchValue = "";
      this.leadSearchResults = null;
      this.contactSearchResults = null;
    } catch (error) {
      console.log("Error clearing search.");
      console.log(error);
      this.dispatchEvent(
        new ShowToastEvent({
          variant: "error",
          message: "Error clearing search."
        })
      );
    }
  }

  get leadOrContact() {
    return this.rowData.actionName;
  }

  handleSearchValueChange(event) {
    this.searchValue = event.target.value;
  }

  async handleSearch() {
    try {
      if (this.searchValue.length >= 2) {
        // call the lead and contact search functions and destructure into the class variables
        [this.leadSearchResults, this.contactSearchResults] = await Promise.all(
          [
            (this.searchResults = await leadSearch({
              searchKey: this.searchValue
            })),
            (this.searchResults = await contactSearch({
              searchKey: this.searchValue
            }))
          ]
        );
      } else if (this.searchValue === "") {
        // clear the search if the user clicks search with an empty search bar
        this.clearSearch();
      } else {
        const event = new ShowToastEvent({
          variant: "error",
          message: "Enter two or more characters to search."
        });
        this.dispatchEvent(event);
      }
    } catch (error) {
      console.log("search error");
      console.log(error);
      this.dispatchEvent(
        new ShowToastEvent({
          variant: "error",
          message: "Search error."
        })
      );
    }
  }

  async handleEnter(event) {
    if (event.keyCode === 13) {
      await this.handleSearch();
    }
  }
}
