import { LightningElement, track } from "lwc";
import getProfile from "@salesforce/apex/GoogleWebService.getProfile";
import getMessages from "@salesforce/apex/GoogleWebService.getMessages";

export default class GoogleConnect extends LightningElement {
  profile;
  email;
  error;

  handleGetProfile() {
    getProfile()
      .then((result) => {
        this.profile = JSON.parse(result);
        this.email = this.profile.emailAddress;
        this.error = undefined;
      })
      .catch((error) => {
        console.log(error);
        this.error = error;
        this.profile = undefined;
      });
  }
}
