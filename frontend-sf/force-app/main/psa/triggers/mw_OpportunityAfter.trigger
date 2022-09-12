trigger mw_OpportunityAfter on Opportunity(after insert, after update) {
  mw_it_psa_settings__c Settings = mw_it_psa_settings__c.getOrgDefaults();

  // create projects
  if (
    (Settings.auto_create_proj_from_opp__c == true) && (Trigger.New.size() < 50)
  ) {
    List<Map<String, Id>> newProjItemIds = mw_CreateProject.CreatebillibleProjects(
      Trigger.New,
      Trigger.Old,
      Trigger.newMap,
      Trigger.oldMap
    );
  }
}
