public with sharing class SuggestedLeadsCaller {
  public static Http http = new Http();
  public static HTTPResponse response;
  public static HttpRequest request;

  // get the suggested leads
  // (the input name do_update was chosen because update is a reserved word)
  // all parameters are strings because passing an Int isn't allowed,
  // and since it's just putting the strings in the query, it's easier and safer
  // to format the strings in js before passing them to the fucntion
  @AuraEnabled
  public static string getSuggestedLeads(
    String do_update,
    String before_date,
    String result_limit
  ) {
    string user_email = UserDetails.getUserEmail(); // UserDetails is another class (not premade)

    string url_path = '/suggested-leads';
    string url_query = '?user=' + user_email;

    if (do_update == 'true' || do_update == 'false') {
      url_query += '&update=' + do_update;
    }

    if (String.isNotBlank(before_date)) {
      url_query += '&before=' + before_date;
    }

    if (String.isNotBlank(result_limit)) {
      url_query += '&limit=' + result_limit;
    }

    // url_query = EncodingUtil.urlEncode(url_query, 'UTF-8');
    System.debug(url_query);

    request = new HttpRequest();
    request.setMethod('GET');
    request.setEndpoint('callout:backend_google_int_1' + url_path + url_query);

    response = http.send(request);
    System.debug(response);
    System.debug(response.getBody());

    return response.getBody();
  }

  // remove a suggested lead (after it was successfully added as a contact or lead)
  @AuraEnabled
  public static string removeSuggestedLead(string email) {
    string user_email = UserInfo.getUserEmail();
    string url_path = '/suggested-leads/delete';
    string url_query = '?user=' + user_email + '&record=' + email;
    System.debug(url_query);

    request = new HttpRequest();
    request.setMethod('DELETE');
    request.setEndpoint('callout:backend_google_int_1' + url_path + url_query);

    response = http.send(request);
    System.debug(response);
    System.debug(response.getBody());

    return response.getBody();
  }

  // add excluded emails from showing as suggested leads
  @AuraEnabled
  public static string addExcludedEmails(string[] emails) {
    string user_email = UserInfo.getUserEmail();
    string url_path = '/excluded-emails';

    // create the json for the request
    JSONGenerator jg = JSON.createGenerator(false); // set boolean value true if you want  pretty format applied
    jg.writeStartObject();
    jg.writeStringField('user', user_email);
    jg.writeFieldName('records');
    jg.writeStartArray();
    for (string e : emails) {
      jg.writeString(e);
    }
    jg.writeEndArray();
    jg.writeEndObject();

    System.debug(jg.getAsString());

    request = new HttpRequest();
    request.setMethod('POST');
    request.setEndpoint('callout:backend_google_int_1' + url_path);
    request.setHeader('Content-Type', 'application/json');
    request.setBody(jg.getAsString());

    response = http.send(request);
    System.debug(response);
    System.debug(response.getBody());

    return response.getBody();
  }
}
