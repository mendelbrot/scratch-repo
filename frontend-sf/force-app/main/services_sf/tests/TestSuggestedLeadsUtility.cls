@isTest
public class TestSuggestedLeadsUtility {
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
    return u;
  }

  static testMethod void testPositiveCases() {
    User u = createMockUser();
    System.runAs(u) {
      Lead ld = new Lead(
        FirstName = 'Test',
        LastName = 'Lead',
        Company = '123 Company',
        Title = 'Xyz'
      );
      insert ld;

      Contact c = new Contact(
        FirstName = 'Test',
        LastName = 'Contact',
        Title = 'Xyz'
      );
      insert c;

      List<Lead> searchLd = SuggestedLeadsUtility.leadSearch('Test Lead');
      List<Contact> searchC = SuggestedLeadsUtility.contactSearch(
        'Test Contact'
      );
      String matchLd = SuggestedLeadsUtility.matchEmailToLead('a@q.com', Ld.Id);
      String matchC = SuggestedLeadsUtility.matchEmailToContact(
        'a@q.com',
        c.Id
      );

      System.assertEquals(searchLd[0].Name, 'Test Lead');
      System.assertEquals(searchC[0].Name, 'Test Contact');
      System.assertEquals(matchLd, 'success');
      System.assertEquals(matchC, 'success');
    }
  }
}
