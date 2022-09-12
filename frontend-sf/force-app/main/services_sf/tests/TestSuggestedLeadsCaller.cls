@isTest
public class TestSuggestedLeadsCaller {
  // I couldn't use this method to do System.runAs because I'm also using HttpCalloutMock
  // Weirdly, I can do either of the two most useful test utilities,
  // (System.runAs and HttpCalloutMock) on their own, but trying to combining them
  // in in the same test seems like quite a headache.
  // https://salesforce.stackexchange.com/questions/46438/unit-test-you-have-uncommitted-work-pending-please-commit-or-rollback-before-c
  // https://salesforce.stackexchange.com/questions/296282/test-fails-with-runas-queueable-and-callout-in-specific-org
  // https://salesforce.stackexchange.com/questions/4326/webservicemock-causing-calloutexception-you-have-uncommitted-work-pending-whe
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

  // Inner classes used for serialization by readValuesAs().
  public class ResClass {
    public string user;

    public ResClass(string user) {
      this.user = user;
    }
  }

  static testMethod void testGetSuggestedLeads() {
    // was not able to do System.runAs with HttpCalloutMock
    // User u = createMockUser();
    // System.debug(u);
    // System.runAs(u) {

    // Set mock callout class
    Test.setMock(HttpCalloutMock.class, new MockHttpResponseGenerator());

    string resBody = SuggestedLeadsCaller.getSuggestedLeads('true', '0', '0');
    System.debug(resBody);

    // the rest of this method parses the json string to trivially assert the user email
    JSONParser jp = JSON.createParser(resBody);

    // make sure we are at the start of the object
    jp.nextToken();
    System.assertEquals(JSONToken.START_OBJECT, jp.getCurrentToken());

    // create an object from the json
    ResClass resObject = (ResClass) jp.readValueAs(ResClass.class);
    System.assertEquals('new.user@mistywest.com', resObject.user);
  }

  static testMethod void testRemoveSuggestedLead() {
    // Set mock callout class
    Test.setMock(HttpCalloutMock.class, new MockHttpResponseGenerator());

    string resBody = SuggestedLeadsCaller.removeSuggestedLead(
      'remove@home.com'
    );
    System.debug(resBody);

    // the rest of this method parses the json string to trivially assert the user email
    JSONParser jp = JSON.createParser(resBody);

    // make sure we are at the start of the object
    jp.nextToken();
    System.assertEquals(JSONToken.START_OBJECT, jp.getCurrentToken());

    // create an object from the json
    ResClass resObject = (ResClass) jp.readValueAs(ResClass.class);
    System.assertEquals('new.user@mistywest.com', resObject.user);
  }

  static testMethod void testAddExcludedEmails() {
    // Set mock callout class
    Test.setMock(HttpCalloutMock.class, new MockHttpResponseGenerator());

    String[] emails = new String[2];
    emails[0] = 'exclude1@home.com';
    emails[1] = 'exclude2@home.com';

    string resBody = SuggestedLeadsCaller.addExcludedEmails(emails);
    System.debug(resBody);

    // the rest of this method parses the json string to trivially assert the user email
    JSONParser jp = JSON.createParser(resBody);

    // make sure we are at the start of the object
    jp.nextToken();
    System.assertEquals(JSONToken.START_OBJECT, jp.getCurrentToken());

    // create an object from the json
    ResClass resObject = (ResClass) jp.readValueAs(ResClass.class);
    System.assertEquals('new.user@mistywest.com', resObject.user);
  }
}
