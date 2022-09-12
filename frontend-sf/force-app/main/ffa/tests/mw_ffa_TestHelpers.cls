@isTest
public with sharing class mw_ffa_TestHelpers {
  public static User createMockUser() {
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

    PermissionSetGroup psg = [
      SELECT Id
      FROM PermissionSetGroup
      WHERE DeveloperName = 'FFA_user_permission_set'
    ];
    system.debug(psg);
    insert new PermissionSetAssignment(
      AssigneeId = u.Id,
      PermissionSetGroupId = psg.Id
    );

    return u;
  }

  public static Map<String, SObject> createRecordsAccount() {
    Contact c = new Contact(FirstName = 'Test', LastName = 'Contact');
    insert c;

    Account a = new Account(Name = 'Test a');
    insert a;

    return new Map<String, SObject>{ 'c' => c, 'a' => a };
  }
}
