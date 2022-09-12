trigger mw_SalesInvoiceLineItem on c2g__codaInvoiceLineItem__c(before insert) {
  mw_SalesInvoices.invoiceLineItemSetFields(Trigger.New, Trigger.newMap);
}
