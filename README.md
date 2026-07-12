# Resume Creator

![image](https://github.com/user-attachments/assets/dfae46cd-61e6-44f1-9517-2590c75ed751)

## What is it?
Resume Creator enables forming a resume, styling it and dowloading it. The resulting cv, one or multiple, can be download and used in a real-life job application. Data is stored locally since the project is self-hosted and deployed via a CI/CD pipeline.

## More information

### ***How can I create a resume with the tool?*** ###
User is presented with two options: (1) create a resume by following a default example loaded with the tool or (2) start from a clean slate and design one of their own. 

### ***How many resumes can I make?*** ###
The limit is 5 per account. Just to save my database from oblivion.

### ***How can I style the resume?*** ###
Each resume is styled with in-build options to create a look suitable for user's needs and preferences. Two basic cv preferences are colored resume vs classic black-and-white underline resume style. The other options include color selection, layout, and font family.

### ***How can I get the cv?*** ###
Each cv can be downloaded via a button in top right corner.

### ***What if I want to choose the order of sections or leave some out?*** ###
The project version 1 did not ship with that, but the features will be integrated in version 2.

### ***Will my data be deleted?*** ###
Only the user who has made an account will have their previous resume data saved. If a user chooses to use the tool as a guest, the data will be lost after a page refresh or leaving the page.

### ***Can I make an account?*** ###
Of course. The point of having an account here is so that the returning user can continue working where they left off. The feature of account making and data storage have been integrated in Version 2. The idea is for the user login data to be stored in a database, along with each resume (up to a limit of 5), the individual information they hold and the style for each one.

### ***What features are there?*** ###
+ document save feature 
+ light / dark mode
+ account creation 
+ login authentication system
+ use without login as anonymous
+ cookie session system
+ reorder of elements to user preference how they appear on the pdf
+ 1:1 ratio of font size and spacing to a real pdf
+ pdf styling throught different fonts, design (filled or underline) and layout

### ***What tools does the project use?*** ###
+ Framework: [React](https://react.dev/learn)
+ styling: my own [sass library](https://github.com/axlothecook/axlothecook-sass-library)
+ server: [Nodejs](https://nodejs.org/en)
+ db: [MongoDB](https://www.mongodb.com)
