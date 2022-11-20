*** Settings ***
Documentation    Get linkedin urls from name and company
Library    SeleniumLibrary
Resource    ../resources/common.robot
Resource    ../resources/linkedin.robot

*** Tasks ***
Linkedin Names Search
    [Setup]    Start
    Start Linkedin Sales
    Search For Linkedin Profile    Taylor Cooper MistyWest
    [Teardown]    Finish
    



