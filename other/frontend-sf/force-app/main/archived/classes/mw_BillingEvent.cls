public with sharing class mw_BillingEvent {
  public static void billingEventItemAddDataForInvoice(
    List<pse__Billing_Event_Item__c> TriggerNew,
    Map<Id, pse__Billing_Event_Item__c> TriggerNewMap
  ) {
    // get the map of billing event item id => project id
    Map<Id, Id> biId_to_projId = new Map<Id, Id>();
    for (pse__Billing_Event_Item__c bi : TriggerNew) {
      biId_to_projId.put(bi.Id, bi.pse__Project__c);
    }

    // create the map of projects
    Map<Id, pse__Proj__c> projId_to_proj = new Map<Id, pse__Proj__c>(
      [
        SELECT
          Id,
          Services_Product_2__c,
          Expenses_Product__c,
          Services_Tax_Code__c,
          Expenses_Tax_Code__c
        FROM pse__Proj__c
        WHERE Id IN :biId_to_projId.values()
      ]
    );

    // update the billing event items
    for (pse__Billing_Event_Item__c bi : TriggerNew) {
      Id projId = biId_to_projId.get(bi.Id);
      pse__Proj__c proj = projId_to_proj.get(projId);

      if (bi.pse__Category__c == 'Timecard') {
        bi.ffpsai__ServicesProduct__c = proj.Services_Product_2__c;
        bi.Product__c = proj.Services_Product_2__c;
        bi.Tax_Code__c = proj.Services_Tax_Code__c;
        bi.pse__Description__c = 'line 1\nline 2';
      } else if (bi.pse__Category__c == 'Expense') {
        bi.Product__c = proj.Expenses_Product__c;
        bi.ffpsai__ServicesProduct__c = proj.Expenses_Product__c;
        bi.Tax_Code__c = proj.Expenses_Tax_Code__c;
        bi.pse__Description__c = 'line 1\nline 2';
      }
    }
  }
}
