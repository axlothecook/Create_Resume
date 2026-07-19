# Create Resume Frontend Repo

![image](https://github.com/user-attachments/assets/dfae46cd-61e6-44f1-9517-2590c75ed751)

## What is it?
Resume Creator enables forming a resume, styling it and downloading it. The resulting cv, one or multiple, can be downloaded and used in a real-life job application. Guest data lives only in the browser, while account data is stored in a database on my own server, since the project is self-hosted. It's deployed via a [CI/CD pipeline](https://github.com/axlothecook/homelab-ci-cd).


## More information

### ***How can I create a resume with the tool?*** ###
User is presented with two options: 
(1) create a resume by following a default example loaded with the tool or <br />
(2) start from a clean slate and design one of their own. 
<br />

### ***How many resumes can I make?*** ###
The limit is 5 per account. Just to save my database from oblivion.

### ***How can I style the resume?*** ###
Each resume is styled with built-in options to create a look suitable for user's needs and preferences. Two basic cv preferences are colored resume vs classic black-and-white underline style. The other options include color selection, layout, and font family.

### ***How can I get the cv?*** ###
Each cv can be downloaded via a button in bottom right corner.

### ***What if I want to choose the order of sections or leave some out?*** ###
Version 2 shipped exactly this. Items can now be dragged to reorder, and each item can be shown or hidden individually.

### ***Will my data be deleted?*** ###
Only the user who has made an account will have their previous resume data saved. If a user chooses to use the tool as a guest, the data will be lost after a page refresh or leaving the page.

### ***Can I make an account?*** ###
Of course. The point of having an account here is so that the returning user can continue working where they left off. Account making and data storage came with Version 2: the user login data is stored in a database, along with each resume (up to a limit of 5), the individual information they hold and the style for each one. Logging in lasts 7 days, or 30 with `remember me` option ticked on.

### ***What features are there?*** ###
<ul> 
	<li>section-by-section editor: personal details, experience, education, projects, skills and languages</li> 
	<li>live A4 preview that mirrors the downloadable PDF</li> 
	<li>one-click vector PDF download, with 1:1 ratio of font size and spacing to the real pdf</li> 
	<li>pdf styling through different fonts, design and layout</li> 
	<li>drag to reorder sections, and per-item show or hide</li>
	 <li>account creation, login authentication and cookie sessions, or use without login as a guest</li> <li>document save feature (up to 5 per account)</li> 
	<li>light / dark mode</li> 
	<li>fully responsive, with a dedicated mobile pass across every page</li> 
</ul>

## ***How it works***
The app work is depicted in the graph below. Everything about building the resume happens in the browser: edits update React state, which feeds both the live preview and the PDF renderer. Only accounts and saved resumes travel over the network, to the backend.

![image](https://github.com/user-attachments/assets/2e58fa7e-a839-48b9-adc9-143fea716dbe)


## Testing
The resume preview components and the date formatting logic are covered by 20 unit tests. They run in CI before every deploy; if any fail, nothing gets deployed. The pipeline itself is explained in [homelab-ci-cd](https://github.com/axlothecook/homelab-ci-cd).


### ***What tools does the project use?*** ###
+ styling: my own [sass library](https://github.com/axlothecook/axlothecook-sass-library)
+ [React 19](https://react.dev) + [Vite](https://vite.dev): the app and its build tooling <br />
+ [@react-pdf/renderer](https://react-pdf.org): renders the resume as a real vector PDF, right in the browser <br />
+ [@dnd-kit](https://dndkit.com): the drag-to-reorder <br />
+ [MUI X DatePicker](https://mui.com/x/react-date-pickers/) + [dayjs](https://day.js.org): the date inputs <br />
+ plain CSS: hand-written per-feature stylesheets, mobile-first, with the light/dark theme <br />
+ [@fontsource](https://fontsource.org): self-hosted fonts, Poppins for the app UI plus the resume font options <br />
+ [Vitest](https://vitest.dev) + [React Testing Library](https://testing-library.com): the test runner and component tests
