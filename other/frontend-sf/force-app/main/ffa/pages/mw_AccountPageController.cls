public with sharing class mw_AccountPageController {
  public Id acctId { get; set; }

  public mw_AccountPageController(ApexPages.STandardController ctr) {
    this.acctId = ctr.getId();
  }

  public PageReference convertToCustomerAction() {
    mw_Accounts.convertToCustomer(this.acctId);
    Pagereference p = new PageReference('/' + this.acctId);
    p.setRedirect(true);
    return p;
  }

  public PageReference convertToVendorAction() {
    mw_Accounts.convertToVendor(this.acctId);
    Pagereference p = new PageReference('/' + this.acctId);
    p.setRedirect(true);
    return p;
  }
}
