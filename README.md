# Kai Ika Operations Reporting Web App

This web app is designed to help the Kai Ika team **record daily operations**, including staff hours, sales, distributions, can drop-offs, and other activities. It also **integrates with Loyverse** to automatically fetch your daily sales data.

---

## Key Features

1. **Staff Hours**

   * Add rows for each staff member.
   * Record the task they did and start/end times.
   * The app automatically calculates hours worked.

2. **Sales Recording**

   * Add rows for products sold and their quantities.
   * Enter total sales manually or fetch automatically from **Loyverse**.

3. **Loyverse Integration**

   * Click the **“+ Add Loyverse Sales”** button.
   * The app fetches **all items sold** on the selected date from your Loyverse account, along with their quantities and total sales.
   * Fills your sales table automatically — no manual entry needed.
   * Works alongside manual sales entry; you can edit or add items if needed.

4. **Distributions & Can Drop-offs**

   * Track H&F bins collected and distributed (with sources/destinations), Offal bins collected (with source), Redistribution bins collected (with collector), and kg of cans dropped off (and destination).

5. **Other Activities & Notes**

   * Record fish monitored, roe collected, and general notes.

6. **Single Submission**

   * Everything is submitted at once to a Google Sheet.
   * Loyverse sales are **not sent directly** — they are included with your form submission.

7. **Local Autosave**

   * Your progress is saved in your browser so you can leave and return without losing data.

---

## How it Works

1. **Setup**

   * Enter your **Apps Script Web App URL** during initial setup.
   * The web app will use this URL to send and fetch data from your Google Sheet and Loyverse.

2. **Filling the Form**

   * Select the date and enter who completed the form.
   * Add rows for staff, sales, distributions, cans, and other activities.
   * Optionally, click **+ Add Loyverse Sales** to auto-fill product sales for the day.

3. **Submitting the Form**

   * **Click Review and Submit**, then review, copy if needed, and click **Submit Report**.
   * The app sends all data (manual and Loyverse) to your Google Sheet, keeping a clear, organized log.

4. **Backend (Google Apps Script)**

   * Handles form submission (`doPost`) and writes all data to a Google Sheet.
   * Provides an endpoint (`doGet`) to fetch daily sales from Loyverse.

---

## Technical Details

* **Frontend:** React + Tailwind + localStorage for autosave.
* **Backend:** Google Apps Script with key parameters stored under project settings to avoid exposure.
* **Integration:** Uses the **Loyverse API** to pull receipts by date.
* **Storage:** Google Sheet with rows categorized by type (STAFF, SALES, SALES_TOTAL, COLLECTION, DISTRIBUTION, OFFAL, REDISTRIBUTION, CANS, OTHER, NOTES).

---

## Steps to Use

1. Open the web app in a browser.
2. Enter the web app URL during setup.
3. Select the date and fill out the top info (Form Completed By).
4. Add rows for staff, sales, distributions, cans, and other sections as needed.
5. (Optional) Click **+ Add Loyverse Sales** to pull daily sales automatically.
6. Click **Save Operations Report** to submit everything to the Google Sheet.

---

## Notes

* The Loyverse button only fetches data for the date selected in the form.
* Deploy your Apps Script as a web app, executed as you with access for **Anyone**.
* Keep the Apps Script URL a secret - it is the key to accessing Loyverse data and editing the sheet.
* You can mix manual sales entries with Loyverse sales; the app will combine them.
* Local autosave keeps your progress safe if you leave the page.

--

## Security
* The Apps Script Web App URL is **not** hardcoded in the application.
* Users must paste it in during initial setup.
* This URL is stored in browser localStorage.
* **Keep this URL secret** — anyone with it can submit data and access Loyverse information.
* If the URL is compromised, redeploy the Apps Script to generate a new URL.
