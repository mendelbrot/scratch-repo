public with sharing class GoogleWebService {
  public static Http http = new Http();
  public static HTTPResponse response;
  public static HttpRequest request;

  @AuraEnabled
  public static Object getProfile() {
    request = new HttpRequest();
    request.setMethod('GET');
    request.setEndpoint('callout:GoogleAPI/gmail/v1/users/me/profile');

    response = http.send(request);

    System.debug(response.getBody());
    return response.getBody();
  }

  @AuraEnabled
  public static Object getMessages() {
    request = new HttpRequest();
    request.setMethod('GET');
    request.setEndpoint('callout:GoogleAPI/gmail/v1/users/me/sent');

    response = http.send(request);

    System.debug(response.getBody());
    return response.getBody();
  }
}
