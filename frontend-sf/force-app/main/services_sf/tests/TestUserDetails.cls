@isTest
private class TestUserDetails {
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
  static testMethod void testGetUserEmail() {
    User u = createMockUser();
    System.debug(u);
    System.runAs(u) {
      string e = UserDetails.getUserEmail();
      System.assertEquals('new.user@mistywest.com', e);
    }
  }
  static testMethod void testGetUserInfo() {
    User u = createMockUser();
    System.debug(u);
    System.runAs(u) {
      User info = UserDetails.getUserInfo();
      System.assertEquals('new.user@mistywest.com', info.Email);
      System.assertEquals('New User', info.Name);
    }
  }
}
