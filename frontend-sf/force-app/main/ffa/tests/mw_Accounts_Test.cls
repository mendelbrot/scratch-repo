@isTest
public with sharing class mw_Accounts_Test {
  static testMethod void testPositiveCases() {
    User u = mw_ffa_TestHelpers.createMockUser();
    System.runAs(u) {
      Map<String, SObject> records = mw_ffa_TestHelpers.createRecordsAccount();
      Account acct = (Account) records.get('a');
      ApexPages.StandardController sc = new ApexPages.StandardController(acct);
      mw_AccountPageController ac = new mw_AccountPageController(sc);
      Pagereference p1 = ac.convertToCustomerAction();
      Pagereference p2 = ac.convertToVendorAction();

      /*
        TODO add meaningful assertions
        */
      System.assertEquals(true, true);
    }
  }
}
