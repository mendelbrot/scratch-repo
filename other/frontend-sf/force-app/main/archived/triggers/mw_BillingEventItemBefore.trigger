trigger mw_BillingEventItemBefore on pse__Billing_Event_Item__c(before insert) {
  mw_BillingEvent.billingEventItemAddDataForInvoice(
    Trigger.New,
    Trigger.newMap
  );
}
