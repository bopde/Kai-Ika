## Technical details

This app consists of **three parts**:

1. **Frontend (HTML)** – currently hosted in GitHub pages
2. **Google Apps Script Web App** – how it talks to google sheets & Loyverse
3. **Google Sheet** – data storage

There is no ‘security’ or login. Security relies solely on keeping the apps script URL a secret.

---

## 1. Frontend

This is index.html on the GitHub repo.  It’s a single HTML file.

- Uses React via CDN (no build step)
- Uses Tailwind via CDN
- Submits form data to an Apps Script Web App URL

This is currently hosted by GitHub pages - [Github.com/bopde/Kai-Ika/](https://github.com/bopde/Kai-Ika/)

This is everything the user sees and can interact with. 

### What *must* stay the same

- The `FormData` field names (`"Row Type"`, `"Date"`, `"Staff Name"`, etc.)
- The structure of the `submit()` function
- The fact that the Web App URL is **user‑supplied at runtime**
- The `<form onSubmit={submit}>` structure

These must match what the Apps Script expects.

### What *can* change safely

🟢 Styling - the look and feel

🟢 Labels / layout - you can change the text and how they are laid out

🟢 Product lists, staff lists, dropdown options - you can edit and add products, staff, and drop-downs

🟢 Text and wording - any text changes

### **Adding new data fields**

If you want to **add** data fields (eg a new field for ‘OBC offal), this will need to be changed on the front end (what you see) the back end (what data it expects to be submitted) and the google sheet (create a data column for the new data). 

To add new fields, copy and paste the GitGub code into chatgpt and ask it specifically what you want. Create a new branch in a GitHub repo to try this new code on, so the existing code is kept as a working copy.

---

## 2. Initialization & Security Model (Very Important)

### How security works

All code is fully public and contains no sensitive information.

Instead:

1. The HTML **asks the user** to paste in an Apps Script Web App URL on the initialisation screen.
2. That URL is saved in your browser, and will be saved until you clear cache.
3. All submissions are sent **only** to that URL

### Why this is intentional

If this link was already in the code (hardcoded - eg, no need to paste it in at the start), then anyone who found this report link would be able to submit data and see our Loyverse data. This would just invite spam. 

**No one can submit data** without the secret Web App URL, which is why it’s critical that it is kept a secret.

### What must stay the same

- The Web App URL **must not be hard‑coded**
- The initialization screen **must remain**
- The Apps Script Web App **must be published as below.**

---

## 3. Google Sheet (Data storage)

### Setup steps

1. Create a new Google Sheet
2. Create a header row matching **exactly** what Apps Script expects
3. The sheet can be renamed, but column names must match the below
4. The google sheet owner must be the same as the apps script owner, or the google sheet must be shared with ‘Anyone with the link’ has ‘editor’ permissions.

### Current columns

```
Row Type
Date
Form Completed By
Submission Timestamp
Staff Name
Task
Start Time
End Time
Hours Worked
Product Name
Quantity Sold
Total Sales
H&F Bins Collected
H&F Source
H&F Bins Distributed
Distribution To
Offal Bins Collected
Offal Source
Redistribution Bins Distributed
Redistribution To
Cans KG
Cans Location
Fish Monitored
Roe Collected
Notes

---

## 4. Google Apps Script (Backend)

### What this is

Google Apps Script is the code that sits in the middle of everything. 

This Apps Script code talks to the front end website and accepts the data it submits, then writes it into the google sheet. It will also fetch Loyverse data and send it to the front end, when the ‘add Loyverse sales’ button is clicked.

---

### How to recreate it

1. Open the Google Sheet
2. Click Extensions → Apps Script
3. Paste in the apps-script.js code from the GitHub repo.
4. To hide the Loyverse API key and the Spreadsheet ID (with these, someone could access our Loyverse and our spreadsheet) they are added in ‘script properties, not in the code. To set these, go to **Project Settings → Script Properties,** and add:

| Key | Value |
| --- | --- |
| `SPREADSHEET_ID_dev` | The Google Sheet ID |
|  `LOYVERSE_TOKEN` | Loyverse API |
| `SHEET_NAME` | The name of the sheet tab the data will be copied into.  |

These **must not** be in the frontend. Our Loyverse API key can be found in the Loyverse back office under extensions. The Google Sheet ID is the URL code between /d/ …and… /edit.

### Deploying the Apps Script

Once the Apps Script is copied and pasted in, click the deployment button and change it to the following settings:

- **Deployment type:** `Web App`
- **Execute as:** `Me`
- **Who has access:** `Anyone with the link` **(NOT “Anyone”)**

This creates a long, unguessable URL like: https://script.google.com/macros/s/AKfycbx.../exec

That URL is the key to the sheet.

---

## 6. How To Use This (End‑to‑End)

1. Clone or fork the GitHub repo
2. Deploy index.html as a GitHub page (Settings > Pages > Select Branch)
3. Create a Google Sheet with the exact column headers
4. Create an Apps Script, and paste in the apps-script.js. 
5. Set Script Properties for spreadsheet ID, sheet name, and Loyverse API key
6. Deploy the Apps Script Web App
7. Copy the Web App URL
8. Open the front end (GitHub will show you the link at the top of the page (Settings > Pages))
9. Paste the URL into the initialization screen

---

## 7. What Breaks This System

❌ Hard‑coding the Web App URL - always keep it as a paste-in option on the initialisation screen

❌ Publishing Apps Script as “Anyone” 

❌ Changing FormData field names

❌ Changing the sheet tab name (the spreadsheet name can be changed without issue)
