public with sharing class mw_CreateProject {
  /* after creating the projects from the opportunity, returns this list:
    [
      {
        'oppId': <Id>,
        'templateId': <Id>,
        'projId': <Id>
      },
      ...
    ]
    */
  public static List<Map<String, Id>> CreatebillibleProjects(
    List<Opportunity> TriggerNew,
    List<Opportunity> TriggerOld,
    Map<Id, Opportunity> TriggerNewMap,
    Map<Id, Opportunity> TriggerOldMap
  ) {
    mw_it_psa_settings__c Settings = mw_it_psa_settings__c.getOrgDefaults();

    // the opportunity ids are mapped to the project template ids
    Map<Id, Id> oppId_to_projTemplateId = new Map<Id, Id>();

    // loop to build the oppId_to_projTemplateId map
    for (Opportunity o : TriggerNew) {
      // only include if the new stage is as determined from custom setting
      if (o.StageName != Settings.opp_proj_create_stage__c) {
        continue;
      }

      // only include if the stage had changed
      if (
        TriggerOldMap.get(o.Id).StageName == Settings.opp_proj_create_stage__c
      ) {
        continue;
      }

      // add the project template id to the map
      if (o.Project_Template__c != null) {
        oppId_to_projTemplateId.put(o.Id, o.project_Template__c);
      } else if (Settings.default_proj_billible__c != null) {
        oppId_to_projTemplateId.put(o.Id, Settings.default_proj_billible__c);
      } else {
        continue;
      }
    }

    // do a query to get the project templates' field values
    Map<Id, pse__Proj__c> projTemplates = new Map<Id, pse__Proj__c>(
      [
        SELECT
          pse__Project_Type__c,
          pse__Billing_Type__c,
          pse__Stage__c,
          pse__Notes__c,
          ffpsai__ServicesProduct__c,
          Expenses_Product__c,
          Expenses_Tax_Code__c,
          Services_Tax_Code__c,
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

    // start the list of new projects
    List<pse__Proj__c> newProjs = new List<pse__Proj__c>();

    // loop to create the new projects from the templates and opps data
    for (Id oppId : oppId_to_projTemplateId.keyset()) {
      Id projTemplateId = oppId_to_projTemplateId.get(oppId);
      pse__Proj__c projTemplate = projTemplates.get(projTemplateId);
      Opportunity opp = TriggerNewMap.get(oppId);

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
      proj.Name = opp.Name + ' - Project';
      proj.CurrencyIsoCode = opp.CurrencyIsoCode;
      proj.Project_Code__c = opp.Project_Code__c;
      proj.pse__Region__c = opp.pse__Region__c;
      proj.pse__Account__c = opp.AccountId;
      proj.pse__Opportunity__c = opp.Id;
      proj.pse__Project_Manager__c = opp.Project_Manager_psa__c;
      proj.Tech_Lead__c = opp.Tech_Lead_psa__c;
      proj.pse__Start_Date__c = opp.Start_Date__c;
      proj.pse__End_Date__c = opp.End_Date__c;

      newProjs.add(proj);
    }

    insert newProjs;

    // call the create related objects function and build the return data
    List<Map<String, Id>> returnDataList = new List<Map<String, Id>>();
    for (pse__Proj__c proj : newProjs) {
      Id oppId = proj.pse__Opportunity__c;
      Id templateId = oppId_to_projTemplateId.get(proj.pse__Opportunity__c);
      Id projId = proj.Id;
      mw_CreateProject.FutureCreateRelatedOblects(oppId, templateId, projId);

      Map<String, Id> returnDataItem = new Map<String, Id>{
        'oppId' => oppId,
        'templateId' => templateId,
        'projId' => proj.Id
      };
      returnDataList.add(returnDataItem);
    }

    return returnDataList;
  }

  /* 
  create related objects:
  - project rate cards
  - milestones
  - resource requests from opportunity
  */

  public static void createProjectRateCards(
    Id oppId,
    Id templateId,
    Id projId
  ) {
    Opportunity opp = [
      SELECT CurrencyIsoCode, Hourly_Rate_CAD__c
      FROM Opportunity
      WHERE Id = :oppId
    ];

    if ((opp.Hourly_Rate_CAD__c == null) || (opp.Hourly_Rate_CAD__c == 0)) {
      return;
    }

    List<Project_Rate_Card__c> templateProjectRateCards = new List<Project_Rate_Card__c>(
      [
        SELECT Resource_Role__c
        FROM Project_Rate_Card__c
        WHERE Project__c = :templateId
      ]
    );

    List<Project_Rate_Card__c> projectRateCards = new List<Project_Rate_Card__c>();

    for (Project_Rate_Card__c template_prc : templateProjectRateCards) {
      Project_Rate_Card__c prc = new Project_Rate_Card__c(
        CurrencyIsoCode = opp.CurrencyIsoCode,
        Bill_Rate__c = opp.Hourly_Rate_CAD__c,
        Resource_Role__c = template_prc.Resource_Role__c,
        Project__c = projId
      );

      projectRateCards.add(prc);
    }

    insert projectRateCards;

    return;
  }

  public static void createMilestones(Id oppId, Id templateId, Id projId) {
    pse__Proj__c proj = [
      SELECT CurrencyIsoCode, pse__Start_Date__c, pse__End_Date__c
      FROM pse__Proj__c
      WHERE Id = :projId
    ];

    if ((proj.pse__End_Date__c == null)) {
      return;
    }

    List<pse__Milestone__c> templateMilestones = new List<pse__Milestone__c>(
      [
        SELECT Name, pse__Description__c, pse__Planned_Hours__c
        FROM pse__Milestone__c
        WHERE pse__Project__c = :templateId
      ]
    );

    List<pse__Milestone__c> milestones = new List<pse__Milestone__c>();
    for (pse__Milestone__c template_m : templateMilestones) {
      pse__Milestone__c m = template_m.clone(false, true, false, false);
      m.CurrencyIsoCode = proj.CurrencyIsoCode;
      m.pse__Target_Date__c = proj.pse__End_Date__c;
      m.pse__Project__c = projId;
      milestones.add(m);
    }

    insert milestones;

    return;
  }

  public static void updateResourceRequestsFromOpp(
    Id oppId,
    Id templateId,
    Id projId
  ) {
    pse__Proj__c proj = [
      SELECT
        CurrencyIsoCode,
        pse__Region__c,
        pse__Start_Date__c,
        pse__End_Date__c
      FROM pse__Proj__c
      WHERE Id = :projId
    ];

    List<pse__Resource_Request__c> opp_RRs = new List<pse__Resource_Request__c>(
      [
        SELECT Id, pse__Project__c
        FROM pse__Resource_Request__c
        WHERE pse__Opportunity__c = :oppId
      ]
    );

    for (pse__Resource_Request__c orr : opp_RRs) {
      if (orr.pse__Project__c != null) {
        continue;
      }

      orr.CurrencyIsoCode = proj.CurrencyIsoCode;
      orr.pse__Region__c = proj.pse__Region__c;
      orr.pse__Project__c = projId;
      // orr.pse__Start_Date__c = proj.pse__Start_Date__c;
      // orr.pse__End_Date__c = proj.pse__End_Date__c;
    }

    update opp_RRs;

    return;
  }

  @future
  public static void FutureCreateRelatedOblects(
    Id oppId,
    Id templateId,
    Id projId
  ) {
    mw_CreateProject.createProjectRateCards(oppId, templateId, projId);
    mw_CreateProject.createMilestones(oppId, templateId, projId);
    mw_CreateProject.updateResourceRequestsFromOpp(oppId, templateId, projId);
  }
}
