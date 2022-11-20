*** Settings ***
Documentation    my first robot framework automation
Library    SeleniumLibrary

*** Variables ***
${BROWSER}    Chrome

*** Keywords ***
Start
    Evaluate    chromedriver_binary.add_chromedriver_to_path()     modules=chromedriver_binary
    Set Selenium Timeout    10
    Set Selenium Speed    0
    Open Browser    browser=${BROWSER}


Finish
    Close Browser