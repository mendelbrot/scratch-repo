# RivalProject
Scratch-and-Win

![alt text](https://github.com/janjosef777/RivalProject/blob/master/md_resources/images/Rivallogo.png)

## Hosted Prototype
[https://boiling-reef-95628.herokuapp.com/](https://boiling-reef-95628.herokuapp.com/)

login:
username: admin
password: admin

## Overview

Our application is designed to let users create and customize a scratch and win card with a easy to use system. Users are able to customize the scratch overlay and the images behind the cards.

## Goals

1. Easy-to-use system to let users create and customize cards

2. Send a link to the customer that lets them use the scratch card 

## Specifications

Built on top the concept scratch card concept provided by the project host. 
[https://github.com/DelsonTan/scratch-card-single](https://github.com/DelsonTan/scratch-card-single)
[https://singlegifscratchcard.herokuapp.com/](https://singlegifscratchcard.herokuapp.com/)
### Technologies

Node.js

React 

MySQL

### Core App Features:

1.	The app should support persistent storage of scratch pages - to this end users should be able to create, read, update, and delete scratch & win pages using the app.
2.	Using the editing UI users should be able to execute the following authoring functions: a) Populate and crop a media asset that will appear under the scratch surface for a given card.  b) Customize the title message on a scratch card c) customize the completion message on a scratch card
3.	From the inspect view the user should be able to launch a preview of the scratch card. 
4.	From the inspect view the user should be able to publish a scratch page as a live entity that can be accessed from a URL.  Users should be able to unpublish a scratch card. 

### Love to have Features:

1.	Users can assign multiple media assets to the scratch card and have one of those populate to the scratch card based on a randomization script.  On refresh, the page would populate the scratch card with a different prize image randomly.
2.	Users should be able to “inspect" a scratch page. From the inspect view users should able to place the page it into a WSYWIG editable state to support authoring and content customization. 

### Nice to have Features: 

1.	Users can populate the media in a scratch card through a native GIF search via a service like Giphy.
2.	Users can archive scratch pages.
3.	Users can monitor basic engagement stats for a scratch page - number of page hits, number of completed scratches, devices stats, etc.
4.	Users can populate a video assets as a media asset in a scratch card.  

# ERD

![alt text](https://github.com/janjosef777/RivalProject/blob/master/md_resources/images/RivalProjectERD.jpg)

# Use Case Diagram

![alt text](https://github.com/janjosef777/RivalProject/blob/master/md_resources/images/RivalProjectUseCase.jpg)

# Wireframes

[https://xd.adobe.com/view/d5faf8e5-5579-4314-76cf-ceef0fc19126-a3cb/](https://xd.adobe.com/view/d5faf8e5-5579-4314-76cf-ceef0fc19126-a3cb/)

# Installation & Deployment

To install this package and start the app or to deploy it to Heroku, you can find all the instructions in the following link:
[https://docs.google.com/document/d/1iE-NIJLleTwfvvI9jTNOrH_7nYTcgA2aY6Ffz7bruYM/edit?usp=sharing](https://docs.google.com/document/d/1iE-NIJLleTwfvvI9jTNOrH_7nYTcgA2aY6Ffz7bruYM/edit?usp=sharing)
