public with sharing class mw_SalesInvoices {
  public static Map<Id, c2g__codaTaxRate__c> getTaxCodesRateData() {
    // for each tax code
    // select tax rates with that tax code
    // sort recent or autonumber
    // limit 1
    Map<Id, c2g__codaTaxRate__c> taxCodeRateData = new Map<Id, c2g__codaTaxRate__c>();
    for (c2g__codaTaxCode__c tc : [
      SELECT
        Id,
        Name,
        (
          SELECT Id, c2g__Rate__c, c2g__StartDate__c
          FROM c2g__TaxRates__r
          ORDER BY c2g__StartDate__c DESC NULLS LAST
          LIMIT 1
        )
      FROM c2g__codaTaxCode__c
    ]) {
      c2g__codaTaxRate__c taxRate = tc.c2g__TaxRates__r[0];
      taxCodeRateData.put(tc.Id, taxRate);
    }
    return taxCodeRateData;
  }

  public static void invoiceLineItemSetFields(
    List<c2g__codaInvoiceLineItem__c> TriggerNew,
    Map<Id, c2g__codaInvoiceLineItem__c> TriggerNewMap
  ) {
    mw_it_psa_settings__c Settings = mw_it_psa_settings__c.getOrgDefaults();

    //get the tax rates to apply later
    Map<Id, c2g__codaTaxRate__c> taxCodeRateData = getTaxCodesRateData();

    // update the sales invoice line items
    for (c2g__codaInvoiceLineItem__c si : TriggerNew) {
      if (si.ffpsai__BillingEventItem__c != null) {
        if (si.Category__c == 'Expense') {
          // set expense tax code
          si.c2g__TaxCode1__c = Settings.FFA_tax_code_expenses__c;
          // set expense product
          si.c2g__Product__c = Settings.FFA_product_expenses__c;
          // set expense description
          si.c2g__LineDescription__c = si.Expense_Description__c;
        } else if (si.Category__c == 'Timecard') {
          // set service tax code
          if (si.Invoice_Currency__c == 'CAD') {
            si.c2g__TaxCode1__c = Settings.FFA_tax_code_services_CAD__C;
          } else if (si.Invoice_Currency__c == 'USD') {
            si.c2g__TaxCode1__c = Settings.FFA_tax_code_services_USD__C;
          }
          // set service product
          si.c2g__Product__c = Settings.FFA_product_services__c;
          // set service description
          String lineDescription = '{0}{1}\n{2}';
          String projectCode = si.Project_Code__c != null
            ? '[' + si.Project_Code__c + ']'
            : null;
          lineDescription = String.format(
            lineDescription,
            new List<String>{
              projectCode, // {0}
              si.Task_Name__c, // {1}
              si.Assignment_Role__c // {2}
            }
          );
          si.c2g__LineDescription__c = lineDescription;
        }

        // use checkbox to ask FFA to fill in the tax rate from the tax code
        // https://developer.financialforce.com/technical-reference/using-the-salesforce-api/
        // si.c2g__DeriveTaxRate1FromCode__c = true;
        // (does not seem to work)

        // set the tax rate and tax value
        Decimal taxRate = taxCodeRateData.get(si.c2g__TaxCode1__c).c2g__Rate__c;
        Decimal taxValue = si.c2g__NetValue__c * taxRate / 100.0;
        taxValue = taxValue.setScale(2);

        si.c2g__TaxRate1__c = taxRate;
        si.c2g__TaxValue1__c = taxValue;
      }
    }
  }
}
