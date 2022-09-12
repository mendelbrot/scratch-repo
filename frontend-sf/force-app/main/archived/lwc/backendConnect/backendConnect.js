import { LightningElement } from "lwc";
import getData from "@salesforce/apex/BackendCaller.getData";

export default class BackendConnect extends LightningElement {
  data;

  handleGetData() {
    getData()
      .then((result) => {
        console.log(result);
        this.data = JSON.parse(result).data;
        this.error = undefined;
      })
      .catch((error) => {
        console.log(error);
        this.error = error;
        this.data = undefined;
      });
  }
}
