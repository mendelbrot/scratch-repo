public with sharing class mw_Accounts {
  public static void convertToCustomer(Id acctId) {
    mw_it_psa_settings__c Settings = mw_it_psa_settings__c.getOrgDefaults();

    Account acct = [
      SELECT
        Name,
        Type,
        CurrencyIsoCode,
        c2g__CODAAccountsReceivableControl__c,
        c2g__CODAAccountTradingCurrency__c,
        c2g__CODATaxCalculationMethod__c
      FROM Account
      WHERE Id = :acctId
    ];

    acct.Type = 'Customer';

    // AR control account
    if (acct.c2g__CODAAccountsReceivableControl__c == null) {
      if (acct.CurrencyIsoCode == 'CAD' && Settings.FFA_AR_CAD__c != null) {
        acct.c2g__CODAAccountsReceivableControl__c = Settings.FFA_AR_CAD__c;
      } else if (
        acct.CurrencyIsoCode == 'USD' &&
        Settings.FFA_AR_USD__c != null
      ) {
        acct.c2g__CODAAccountsReceivableControl__c = Settings.FFA_AR_USD__c;
      }
    }
    // account trading currency
    if (acct.c2g__CODAAccountTradingCurrency__c == null) {
      if (acct.CurrencyIsoCode == 'CAD') {
        acct.c2g__CODAAccountTradingCurrency__c = 'CAD';
      } else if (acct.CurrencyIsoCode == 'USD') {
        acct.c2g__CODAAccountTradingCurrency__c = 'USD';
      }
    }

    // tax calculation method
    if (acct.c2g__CODATaxCalculationMethod__c == null) {
      if (Settings.FFA_Acct_Tax_Calc_Method__c != null) {
        acct.c2g__CODATaxCalculationMethod__c = Settings.FFA_Acct_Tax_Calc_Method__c;
      }
    }

    update acct;

    // credit terms
    List<fferpcore__AccountCreditTerms__c> ctermsList = new List<fferpcore__AccountCreditTerms__c>(
      [
        SELECT Name
        FROM fferpcore__AccountCreditTerms__c
        WHERE fferpcore__Account__c = :acctId
      ]
    );
    if (ctermsList.size() == 0) {
      fferpcore__AccountCreditTerms__c cterms = new fferpcore__AccountCreditTerms__c();
      cterms.fferpcore__Account__c = acctId;
      cterms.CurrencyIsoCode = acct.CurrencyIsoCode;
      cterms.Name = acct.Name + ' - Credit Terms';
      cterms.fferpcore__Description1__c = 'Net 15';
      cterms.fferpcore__BaseDate1__c = 'Invoice Date';
      cterms.fferpcore__DaysOffset1__c = 15;
      cterms.fferpcore__Discount1__c = 0;

      insert cterms;
    }
  }

  public static void convertToVendor(Id acctId) {
    mw_it_psa_settings__c Settings = mw_it_psa_settings__c.getOrgDefaults();

    Account acct = [
      SELECT
        Name,
        Type,
        CurrencyIsoCode,
        c2g__CODAAccountsPayableControl__c,
        c2g__CODAAccountTradingCurrency__c,
        c2g__CODATaxCalculationMethod__c
      FROM Account
      WHERE Id = :acctId
    ];

    acct.Type = 'Vendor';

    // AP control account
    if (acct.c2g__CODAAccountsPayableControl__c == null) {
      if (acct.CurrencyIsoCode == 'CAD' && Settings.FFA_AP_CAD__c != null) {
        acct.c2g__CODAAccountsPayableControl__c = Settings.FFA_AP_CAD__c;
      } else if (
        acct.CurrencyIsoCode == 'USD' &&
        Settings.FFA_AP_USD__c != null
      ) {
        acct.c2g__CODAAccountsPayableControl__c = Settings.FFA_AP_USD__c;
      }
    }
    // account trading currency
    if (acct.c2g__CODAAccountTradingCurrency__c == null) {
      if (acct.CurrencyIsoCode == 'CAD') {
        acct.c2g__CODAAccountTradingCurrency__c = 'CAD';
      } else if (acct.CurrencyIsoCode == 'USD') {
        acct.c2g__CODAAccountTradingCurrency__c = 'USD';
      }
    }

    // tax calculation method
    if (acct.c2g__CODATaxCalculationMethod__c == null) {
      if (Settings.FFA_Acct_Tax_Calc_Method__c != null) {
        acct.c2g__CODATaxCalculationMethod__c = Settings.FFA_Acct_Tax_Calc_Method__c;
      }
    }

    update acct;

    // credit terms
    List<fferpcore__AccountCreditTerms__c> ctermsList = new List<fferpcore__AccountCreditTerms__c>(
      [
        SELECT Name
        FROM fferpcore__AccountCreditTerms__c
        WHERE fferpcore__Account__c = :acctId
      ]
    );
    if (ctermsList.size() == 0) {
      fferpcore__AccountCreditTerms__c cterms = new fferpcore__AccountCreditTerms__c();
      cterms.fferpcore__Account__c = acctId;
      cterms.CurrencyIsoCode = acct.CurrencyIsoCode;
      cterms.Name = acct.Name + ' - Credit Terms';
      cterms.fferpcore__Description1__c = 'Net 15';
      cterms.fferpcore__BaseDate1__c = 'Invoice Date';
      cterms.fferpcore__DaysOffset1__c = 15;
      cterms.fferpcore__Discount1__c = 0;

      insert cterms;
    }
  }
}
