public with sharing class MW_PSA_ProjFuture {
  @future
  public static void ProjRelatedOblects(Id projId, Id templateId) {
    // called after the MW_PSA_OnOppWon trigger to create related objects for the new project

    List<pse__Assignment__c> templateAssignments = new List<pse__Assignment__c>(
      [
        SELECT Name, pse__Schedule__c
        FROM pse__Assignment__c
        WHERE pse__Project__c = :templateId
      ]
    );

    Set<Id> scheduleIds = new Set<Id>();
    for (pse__Assignment__c a : templateAssignments)
      scheduleIds.add(a.pse__Schedule__c);

    Map<Id, pse__Schedule__c> templateAssignmentSchedules = new Map<Id, pse__Schedule__c>(
      [SELECT Name FROM pse__Schedule__c WHERE Id IN :scheduleIds]
    );

    // clone the assignments and schedules for the new project
    for (pse__Assignment__c a : templateAssignments) {
      System.debug(a);
      System.debug(templateAssignmentSchedules.get(a.pse__Schedule__c));
    }
  }
}
