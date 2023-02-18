*** Settings ***
Documentation    resources for linkedin automation
Library    SeleniumLibrary
Resource    ./common.robot
Resource    ../config.robot

*** Variables ***
${LINKEDIN URL}    https://linkedin.com/sales

*** Keywords ***
Start Linkedin Sales
    Go To    ${LINKEDIN URL}
    Add Cookie    li_at    ${LINKEDIN COOKIE}

Search For Linkedin Profile
    [Arguments]    ${search input}
    Go To    ${LINKEDIN URL}
    Wait Until Page Contains Element    id:global-typeahead-search-input
    Input Text    id:global-typeahead-search-input    ${search input}
    Press Keys    None    RETURN
    Wait Until Page Contains Element    id:search-results-container
    Wait Until Page Contains Element    //a[@data-control-name="view_lead_panel_via_search_lead_name"]
    Click Element   //a[@data-control-name="view_lead_panel_via_search_lead_name"][0]
    Wait Until Page Contains Element    //button[contains(@id, "hue-menu-trigger")]
    Click Element    //button[contains(@id, "hue-menu-trigger")]
    Wait Until Page Contains Element    //a[.//div[contains(@innerHTML,"View LinkedIn profile")]]
    ${LINKEDIN PROFILE}=    Get Element Attribute    //a[.//div[contains(@innerHTML,"View LinkedIn profile")]]    href
    Log    ${LINKEDIN PROFILE}

# <a id="ember421" class="ember-view _item_1xnv7i" href="https://www.linkedin.com/in/coopertaylor" target="_blank">
# <!---->    <div class="_text-container_1xnv7i">
#       <div class="_text_1xnv7i">
#           View LinkedIn profile
#       </div>
# <!---->    </div>
#   </a>
