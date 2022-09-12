public with sharing class UserDetails {
  @AuraEnabled(cacheable=true)
  public static string getUserEmail() {
    // in sandbox, .invalid is added to the end of user emails
    string user_email = UserInfo.getUserEmail().removeEnd('.invalid');
    return user_email;
  }

  @AuraEnabled(cacheable=true)
  public static user getUserInfo() {
    string userId = UserInfo.getUserId();
    user userInfo = [
      SELECT ID, FirstName, LastName, Name, Title, Profile.Name, Email
      FROM User
      WHERE ID = :userId
      LIMIT 1
    ];
    userInfo.Email = userInfo.Email.removeEnd('.invalid');
    System.debug(userInfo);
    return userInfo;
  }
}
