trigger MW_PSA_OnNewProject on pse__Proj__c(before insert) {
  for (pse__Proj__c p : Trigger.New) {
    // System.debug(p.Name);
    p.pse__Include_In_Forecasting__c = true;
    p.pse__Daily_Timecard_Notes_Required__c = false;
    p.pse__Allow_Timecards_Without_Assignment__c = true;
    p.pse__Allow_Self_Staffing__c = true;
    p.pse__Allow_Expenses_Without_Assignment__c = true;
  }
}
