trigger MW_PSA_OnOppWon on Opportunity(after update) {
  // get the custom settings for this trigger
  mw_it_psa_settings__c Settings = mw_it_psa_settings__c.getOrgDefaults();
  // System.debug(Settings);

  // only run if the setting to auto create project is checked
  if (Settings.auto_create_proj_from_opp__c != true) {
    return;
  }

  // only run if there are fewer than 50 opportunities.
  // this is to avoid running into govenor limits
  // when creating related records with the future function at the end.
  // also this trigger is not intended for creating projects in bulk
  if (Trigger.New.size() >= 50) {
    System.debug('50 or more opportunities therefore not proceeding');
    return;
  }

  // the opportunity ids are mapped to the project template ids
  Map<Id, Id> oppId_to_projTemplateId = new Map<Id, Id>();

  // loop to build the oppId_to_projTemplateId map
  for (Opportunity o : Trigger.New) {
    // System.debug(o.Name);
    // System.debug(o.StageName);
    // only include if the new stage is as determined from custom setting
    if (o.StageName != Settings.opp_proj_create_stage__c) {
      continue;
    }

    // System.debug(Trigger.oldMap.get(o.Id).StageName);
    // only include if the stage had changed
    if (
      Trigger.oldMap.get(o.Id).StageName == Settings.opp_proj_create_stage__c
    ) {
      continue;
    }

    // add the project template id to the map
    // use the default if there is no project template on the opp
    // System.debug(o.project_Template__c);
    // System.debug(Settings.default_project_template__c);
    if (o.Project_Template__c != null) {
      oppId_to_projTemplateId.put(o.Id, o.project_Template__c);
    } else {
      oppId_to_projTemplateId.put(o.Id, Settings.default_project_template__c);
    }
  }

  // System.debug(oppId_to_projTemplateId);

  // do a query to get the project templates
  // (here the project template ids are mapped to the project templates)
  // SELECT FIELDS(ALL) not is not supported :(
  Map<Id, pse__Proj__c> projTemplates = new Map<Id, pse__Proj__c>(
    [
      SELECT
        // Id
        // Name,
        // OwnerId,
        // pse__Account__c,
        // pse__Opportunity__c,
        // pse__Project_Manager__c,
        // Tech_Lead__c,
        // pse__Start_Date__c,
        // pse__End_Date__c,
        // Project_ Code__c,
        // pse__Is_Active__c,
        // pse__Closed_for_Time_Entry__c,
        // pse__Closed_for_Expense_Entry__c,
        // pse__Exclude_from_Project_Planner__c,
        // pse__Exclude_from_Backlog__c,
        // pse__Exclude_From_Billing__c,
        // pse__Is_Template__c,
        // msg_link_PSAD4_id__c,
        CurrencyIsoCode,
        pse__Project_Type__c,
        pse__Billing_Type__c,
        pse__Region__c,
        pse__Practice__c,
        pse__Group__c,
        pse__Stage__c,
        pse__Notes__c,
        ffpsai__ServicesProduct__c,
        Bill_By__c,
        HarvestNotes__c,
        Cost_Budget_Include_Expenses__c,
        FFX_Timecard_Notification__c,
        FFX_Expense_Notification__c,
        pse__Project_Status__c,
        pse__Project_Status_Notes__c,
        pse__Is_Billable__c,
        pse__Allow_Self_Staffing__c,
        pse__Allow_Expenses_Without_Assignment__c,
        pse__Allow_Timecards_Without_Assignment__c,
        pse__Time_Credited__c,
        pse__Time_Excluded__c,
        pse__Daily_Timecard_Notes_Required__c,
        pse__Work_Calendar__c,
        pse__Rate_Card_Set__c,
        pse__Include_In_Forecasting__c,
        pse__Recognition_Method__c
      FROM pse__Proj__c
      WHERE Id IN :oppId_to_projTemplateId.values()
    ]
  );

  // System.debug(projTemplates);

  // start the list of new projects
  List<pse__Proj__c> newProjs = new List<pse__Proj__c>();

  // loop to create the new projects from the templates and opps data
  for (Id oppId : oppId_to_projTemplateId.keyset()) {
    Id projTemplateId = oppId_to_projTemplateId.get(oppId);
    pse__Proj__c projTemplate = projTemplates.get(projTemplateId);
    Opportunity opp = Trigger.newMap.get(oppId);

    // System.debug(projTemplate);
    // System.debug(opp);

    // clone the project template
    // preserveId = false,
    // isDeepClone = true,
    // preserveReadonlyTimestamps = false,
    // preserveAutonumber = false
    pse__Proj__c proj = projTemplate.clone(false, true, false, false);

    // undo the settings that should be in place for a template
    proj.pse__ExcludeProjectFromDisplayOnBilling__c = false;
    proj.pse__Exclude_From_Billing__c = false;
    proj.pse__Exclude_from_Backlog__c = false;
    proj.pse__Exclude_from_Project_Planner__c = false;
    proj.pse__Exclude_from_Project_Variance_Batch__c = false;
    proj.pse__Include_In_Forecasting__c = true;
    proj.pse__Is_Template__c = false;
    proj.pse__Is_Active__c = true;

    // populate fields from the opportunity
    proj.Name = opp.Name;
    proj.Project_Code__c = opp.Project_Code__c;
    proj.pse__Account__c = opp.AccountId;
    proj.pse__Opportunity__c = opp.Id;
    proj.pse__Project_Manager__c = opp.Project_Manager_psa__c;
    proj.Tech_Lead__c = opp.Tech_Lead__c;
    proj.pse__Start_Date__c = opp.Start_Date__c;
    proj.pse__End_Date__c = opp.End_Date__c;

    // System.debug(proj);

    // add the new project to the list
    newProjs.add(proj);
  }

  // System.debug(newProjs);

  // finally create the new projects in the database
  // note that afer this insert the Ids are added to all the project objects in the list (this is pretty nice)
  insert newProjs;

  // after creating the new projects we call a future method to create the related objects
  // as input we will give a map proj -> projTemplate
  // (we will create this map by getting the template from the projects opportunity. this could also
  // be done in the future method however all the info is already here without making any new SOQL
  // calls so this will make the future method easier)
  // in the future method, the assignments, etc on the project template will be cloned
  // Map<Id,Id> Proj_to_Template = new Map<Id,Id>();
  // actually to further simplify the future method i will call it in a loop for each project
  // govenor limits specify that at most 50 future method calls are allowed.  around 1 call is expected.

  for (pse__Proj__c p : newProjs) {
    Id oppId = p.pse__Opportunity__c;
    Id templateId = oppId_to_projTemplateId.get(oppId);
    MW_PSA_ProjFuture.ProjRelatedOblects(p.Id, templateId);
  }
}
