public with sharing class BackendCaller {
  public static Http http = new Http();
  public static HTTPResponse response;
  public static HttpRequest request;

  @AuraEnabled
  public static Object getData() {
    request = new HttpRequest();
    request.setMethod('GET');
    request.setEndpoint('callout:backend_google_int_1/');

    response = http.send(request);

    System.debug(response.getBody());
    return response.getBody();
  }
}
