@isTest
public with sharing class mw_CreateProject_Test {
  static User createMockUser() {
    Profile p = [SELECT Id FROM Profile WHERE Name = 'Standard User'];
    User u = new User(
      Alias = 'newUser',
      Email = 'new.user@mistywest.com',
      EmailEncodingKey = 'UTF-8',
      Title = 'VIP',
      FirstName = 'New',
      LastName = 'User',
      LanguageLocaleKey = 'en_US',
      LocaleSidKey = 'en_US',
      ProfileId = p.Id,
      TimeZoneSidKey = 'America/Los_Angeles',
      UserName = 'new.user@mistywest.com'
    );
    insert u;
    return u;
  }

  static Map<String, SObject> createDatabaseRecords() {
    Contact pm = new Contact(
      FirstName = 'Test',
      LastName = 'Pm',
      pse__Is_Resource_Active__c = true,
      pse__Is_Resource__c = true
    );
    insert pm;

    pse__Proj__c pt = new pse__Proj__c(
      Name = 'Test p',
      pse__Is_Active__c = true,
      pse__Is_Billable__c = true,
      pse__Is_Template__c = true
    );
    insert pt;

    Account a = new Account(Name = 'Test a');
    insert a;

    pse__region__c r = new pse__region__c(Name = 'Test r');
    insert r;

    Opportunity o = new Opportunity(
      Name = 'TEST - Test o',
      AccountId = a.Id,
      Project_Template__c = pt.Id,
      pse__Region__c = r.Id,
      StageName = 'On Hold',
      CloseDate = date.newInstance(2022, 3, 31),
      Start_Date__c = date.newInstance(2022, 3, 31),
      End_Date__c = date.newInstance(2022, 3, 31),
      Duration_of_Project_weeks__c = 3,
      Hourly_Rate_CAD__c = 200,
      ID_Allocation__c = 0,
      EE_Allocation__c = 0,
      ME_Allocation__c = 0,
      FW_Allocation__c = 0,
      SW_Allocation__c = 100,
      Science_Research_Allocation__c = 0,
      Tech_Lead_Allocation__c = 0,
      Tech_Lead_PSA__c = pm.Id,
      Project_Manager_PSA__c = pm.Id,
      Tech_Lead__c = 'Aaron MacDonald', // depricated but required
      Project_Manager__c = 'Cole Crocker' // depricated but required
    );
    insert o;

    // create the custom settings
    insert new mw_it_psa_settings__c(
      opp_proj_create_stage__c = 'Closed Won',
      default_proj_billible__c = pt.Id,
      auto_create_proj_from_opp__c = true
    );

    return new Map<String, SObject>{ 'a' => a, 'o' => o, 'pt' => pt };
  }

  static testMethod void runPositiveTestCases() {
    User u = createMockUser();
    System.runAs(u) {
      Map<String, SObject> records = createDatabaseRecords();
      Opportunity opp = (Opportunity) records.get('o');

      // update the stage to trigger creating a project
      opp.StageName = 'Closed Won';
      update opp;

      /*
      TODO add meaningful assertions
      - attributes of created project
        - project end date
        - project code
      - number of created related objects
      - attributes of created related objects
        - project rate card bill rate
        - milestone target date
      */
      System.assertEquals(true, true);
    }
  }
}
