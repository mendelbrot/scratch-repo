public with sharing class SuggestedLeadsUtility {
  @AuraEnabled
  public static List<Contact> contactSearch(String searchKey) {
    List<String> filters = searchKey.split(' ');
    String queryString =
      'SELECT' +
      ' Id, Name, FirstName, LastName, Account.Name, Account.Id' +
      ' FROM Contact WHERE';
    String filter0 = '%' + filters[0] + '%';
    String filter1 = null;
    String filter2 = null;
    queryString += ' Name LIKE :filter0';
    try {
      filter1 = '%' + filters[1] + '%';
      queryString += ' AND';
      queryString += ' Name LIKE :filter1';
    } catch (Exception e) {
    }
    try {
      filter2 = '%' + filters[2] + '%';
      queryString += ' AND';
      queryString += ' Name LIKE :filter2';
    } catch (Exception e) {
    }
    List<Contact> searchResults = Database.query(queryString);
    return searchResults;
  }

  @AuraEnabled
  public static List<Lead> leadSearch(String searchKey) {
    List<String> filters = searchKey.split(' ');
    String queryString =
      'SELECT' +
      ' Id, Name, FirstName, LastName, Company' +
      ' FROM Lead WHERE';
    String filter0 = '%' + filters[0] + '%';
    String filter1 = null;
    String filter2 = null;
    queryString += ' Name LIKE :filter0';
    try {
      filter1 = '%' + filters[1] + '%';
      queryString += ' AND';
      queryString += ' Name LIKE :filter1';
    } catch (Exception e) {
    }
    try {
      filter2 = '%' + filters[2] + '%';
      queryString += ' AND';
      queryString += ' Name LIKE :filter2';
    } catch (Exception e) {
    }
    List<Lead> searchResults = Database.query(queryString);
    return searchResults;
  }

  @AuraEnabled
  public static String matchEmailToContact(String email, Id recordId) {
    Contact record = [
      SELECT
        Id,
        Name,
        FirstName,
        LastName,
        Email,
        Email_2__c,
        Email_3__c,
        Email_4__c,
        Email_5__c
      FROM Contact
      WHERE Id = :recordId
    ];
    List<String> emailFields = new List<String>{
      'Email',
      'Email_2__c'
      // 'Email_3__c',
      // 'Email_4__c',
      // 'Email_5__c'
    };
    Boolean foundFieldToPutEmail = false;
    for (String field : emailFields) {
      if (record.get(field) == null) {
        foundFieldToPutEmail = true;
        record.put(field, email);
        update record;
        break;
      }
    }
    if (foundFieldToPutEmail == false) {
      return 'all_fields_taken';
    }
    return 'success';
  }

  @AuraEnabled
  public static String matchEmailToLead(String email, Id recordId) {
    Lead record = [
      SELECT
        Id,
        Name,
        FirstName,
        LastName,
        Email,
        Email_2__c,
        Email_3__c,
        Email_4__c,
        Email_5__c
      FROM Lead
      WHERE Id = :recordId
    ];
    List<String> emailFields = new List<String>{
      'Email',
      'Email_2__c'
      // 'Email_3__c',
      // 'Email_4__c',
      // 'Email_5__c'
    };
    Boolean foundFieldToPutEmail = false;
    for (String field : emailFields) {
      if (record.get(field) == null) {
        foundFieldToPutEmail = true;
        record.put(field, email);
        update record;
        break;
      }
    }
    if (foundFieldToPutEmail == false) {
      return 'all_fields_taken';
    }
    return 'success';
  }
}
