function getConfig() {
  const props = PropertiesService.getScriptProperties();
  return {
    SHEET_ID: props.getProperty('SHEET_ID_dev'),
    SHEET_NAME: props.getProperty('SHEET_NAME')
  };
}


/**
 * Centralized field names — DO NOT change these
 */
const F = {
  ROW_TYPE: 'Row Type',
  DATE: 'Date',
  COMPLETED_BY: 'Form Completed By',
  TIMESTAMP: 'Submission Timestamp',

  STAFF_NAME: 'Staff Name',
  TASK: 'Task',
  START_TIME: 'Start Time',
  END_TIME: 'End Time',
  HOURS_WORKED: 'Hours Worked',

  PRODUCT_NAME: 'Product Name',
  QUANTITY: 'Quantity Sold',
  TOTAL_SALES: 'Total Sales',

  BINS_COLLECTED: 'H&F Bins Collected',
  COLLECTED_FROM: 'H&F From',
  BINS_DISTRIBUTED: 'H&F Bins Distributed',
  DISTRIBUTION_TO: 'Distribution To',
  OFFAL_BINS_COLLECTED: 'Offal Bins Collected',
  OFFAL_SOURCE: 'Offal Source',
  REDISTRIBUTION_BINS_COLLECTED: 'Redistribution Bins Collected',
  REDISTRIBUTION_COLLECTOR: 'Redistribution Collector',

  CANS_KG: 'Cans KG',
  CANS_LOCATION: 'Cans Location',

  FISH_MONITORED: 'Fish Monitored',
  ROE_COLLECTED: 'Roe Collected',
  NOTES: 'Notes'
};

/**
 * Column mapping (A=1, B=2, etc.)
 * ... same as before ...
 */

/**
 * Handle normal form submissions
 */
/**
 * Handle normal form submissions
 */
function doPost(e) {
  try {
    const { SHEET_ID, SHEET_NAME } = getConfig();
    if (!SHEET_ID || !SHEET_NAME) {
      throw new Error('Missing SHEET_ID or SHEET_NAME in Script Properties');
    }

    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
    const params = e.parameters || {};
    const timestamp = new Date().toISOString();

    // ---------------------------
    // STAFF
    // ---------------------------
    const staffCount = params[F.STAFF_NAME]?.length || 0;
    for (let i = 0; i < staffCount; i++) {
      const staffName = params[F.STAFF_NAME][i] || '';
      const task = params[F.TASK]?.[i] || '';
      const startTime = params[F.START_TIME]?.[i] || '';
      const endTime = params[F.END_TIME]?.[i] || '';
      if (!staffName && !task && !startTime && !endTime) continue;

      sheet.appendRow([
        'STAFF',
        params[F.DATE]?.[i] || '',
        params[F.COMPLETED_BY]?.[i] || '',
        timestamp,
        staffName,
        task,
        startTime,
        endTime,
        calculateHours(startTime, endTime),
        '', // Product Name
        '', // Quantity Sold
        '', // Total Sales
        '', // H&F bins collected
        '', // Collected From
        '', // H&F bins distributed
        '', // Distributed To
        '', // Offal discarded
        '', // Offal source
        '', // Redistribution bins collected
        '', // Redistribution collector
        '', // Cans KG
        '', // Cans Location
        '', // Fish Monitored
        '', // Roe Collected
        ''  // Notes
      ]);
    }

    // ---------------------------
    // SALES
    // ---------------------------
    const salesCount = params[F.PRODUCT_NAME]?.length || 0;
    for (let i = 0; i < salesCount; i++) {
      const productName = params[F.PRODUCT_NAME][i] || '';
      const quantity = params[F.QUANTITY]?.[i] || '';
      if (!productName && !quantity) continue;

      sheet.appendRow([
        'SALES',
        params[F.DATE]?.[i] || '',
        params[F.COMPLETED_BY]?.[i] || '',
        timestamp,
        '', '', '', '', '',
        productName,
        quantity,
        '',
        '', '', '', '', '', '', '', '', '', '', '', '', '', ''
      ]);
    }

    // ---------------------------
    // TOTAL SALES
    // ---------------------------
    const totalSalesValue = params[F.TOTAL_SALES]?.[0];
    if (totalSalesValue) {
      sheet.appendRow([
        'SALES_TOTAL',
        params[F.DATE]?.[0] || '',
        params[F.COMPLETED_BY]?.[0] || '',
        timestamp,
        '', '', '', '', '',
        '', '', totalSalesValue,
        '', '', '', '', '', '', '', '', '', '', '', '', ''
      ]);
    }

    // ---------------------------
    // COLLECTION
    // ---------------------------
    const binsCollectedValue = params[F.BINS_COLLECTED]?.[0];
    const collectedFromValue = params[F.COLLECTED_FROM]?.[0];
    if (binsCollectedValue || collectedFromValue) {
      sheet.appendRow([
        'COLLECTION',
        params[F.DATE]?.[0] || '',
        params[F.COMPLETED_BY]?.[0] || '',
        timestamp,
        '', '', '', '', '',
        '', '', '',
        binsCollectedValue || '',
        collectedFromValue || '',
        '', '', '', '', '', '', '', '', '', '', ''
      ]);
    }

    // ---------------------------
    // DISTRIBUTION
    // ---------------------------
    const binsDistributed = params[F.BINS_DISTRIBUTED]?.[0];
    const distributionTo = params[F.DISTRIBUTION_TO]?.[0];
    if (binsDistributed || distributionTo) {
      sheet.appendRow([
        'DISTRIBUTION',
        params[F.DATE]?.[0] || '',
        params[F.COMPLETED_BY]?.[0] || '',
        timestamp,
        '', '', '', '', '',
        '', '', '',
        '', '',
        binsDistributed || '',
        distributionTo || '',
        '', '', '', '', '', '', '', '', ''
      ]);
    }

    // OFFAL
    const offalBins = params[F.OFFAL_BINS_COLLECTED]?.[0];
    const offalSource = params[F.OFFAL_SOURCE]?.[0];
    if (offalBins || offalSource) {
      sheet.appendRow([
        'OFFAL',
        params[F.DATE]?.[0] || '',
        params[F.COMPLETED_BY]?.[0] || '',
        timestamp,
        '', '', '', '', '',
        '', '', '',
        '', '',
        '', '',
        offalBins || '',
        offalSource || '',
        '', ''
      ]);
    }

    // REDISTRIBUTION
    const redistributionBins = params[F.REDISTRIBUTION_BINS_COLLECTED]?.[0];
    const redistributionSource = params[F.REDISTRIBUTION_COLLECTOR]?.[0];
    if (redistributionBins || redistributionSource) {
      sheet.appendRow([
        'REDISTRIBUTION',
        params[F.DATE]?.[0] || '',
        params[F.COMPLETED_BY]?.[0] || '',
        timestamp,
        '', '', '', '', '',
        '', '', '',
        '', '',
        '', '',
        '', '',
        redistributionBins || '',
        redistributionSource || '',
        '', '', '', '', '', ''
      ]);
    }



    // ---------------------------
    // CANS
    // ---------------------------
    const cansCount = params[F.CANS_KG]?.length || 0;
    for (let i = 0; i < cansCount; i++) {
      const cansKg = params[F.CANS_KG][i] || '';
      const cansLocation = params[F.CANS_LOCATION]?.[i] || '';
      if (!cansKg && !cansLocation) continue;

      sheet.appendRow([
        'CANS',
        params[F.DATE]?.[i] || '',
        params[F.COMPLETED_BY]?.[i] || '',
        timestamp,
        '', '', '', '', '',
        '', '', '',
        '', '', '', '', '', '', '', '', cansKg, cansLocation, '', '', ''
      ]);
    }

    // ---------------------------
    // OTHER
    // ---------------------------
    const fishMonitoredValue = params[F.FISH_MONITORED]?.[0];
    const roeCollectedValue = params[F.ROE_COLLECTED]?.[0];
    if (fishMonitoredValue || roeCollectedValue) {
      sheet.appendRow([
        'OTHER',
        params[F.DATE]?.[0] || '',
        params[F.COMPLETED_BY]?.[0] || '',
        timestamp,
        '', '', '', '', '',
        '', '', '',
        '', '', '', '', '', '',
        fishMonitoredValue || '',
        roeCollectedValue || '',
        ''
      ]);
    }

    // ---------------------------
    // NOTES
    // ---------------------------
    const notesValue = params[F.NOTES]?.[0];
    if (notesValue) {
      sheet.appendRow([
        'NOTES',
        params[F.DATE]?.[0] || '',
        params[F.COMPLETED_BY]?.[0] || '',
        timestamp,
        '', '', '', '', '',
        '', '', '',
        '', '', '', '', '', '', '', '', '', '', '', '', notesValue
      ]);
    }

    return ContentService.createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}


/**
 * Calculate hours between start and end time strings
 */
function calculateHours(start, end) {
  if (!start || !end) return '';
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  let diff = new Date(0,0,0,eh,em) - new Date(0,0,0,sh,sm);
  if (diff < 0) diff += 24*60*60*1000;
  return Math.round((diff / 36e5)*100)/100;
}

/* =================================================
   LOYVERSE SALES DATA INTEGRATION
   ================================================= */

/**
 * Front-end endpoint: returns summary of Loyverse sales for a given date
 * Takes refunds out of total sales, and only sums 'SALE' receipts for quantities.
 * Called via GET: ?date=YYYY-MM-DD
 */

function doGetLoyverseSales(e) {
  try {
    const date = e.parameter.date;
    if (!date) throw new Error('Missing required "date" parameter');

    const token = PropertiesService.getScriptProperties().getProperty('LOYVERSE_TOKEN');
    if (!token) throw new Error('LOYVERSE_TOKEN not set in Script Properties');

    const { startISO, endISO } = getNZDateRangeUTC(date);


    let cursor = null;

    const salesMap = {};      // Stores sale line items by receipt
    let netTotalSales = 0;    // Net total sales in dollars
    const items = {};          // Net quantities and totals per product

    do {
      let url = `https://api.loyverse.com/v1.0/receipts?created_at_min=${encodeURIComponent(startISO)}&created_at_max=${encodeURIComponent(endISO)}&limit=200`;
      if (cursor) url += `&cursor=${cursor}`;

      const options = {
        method: 'get',
        headers: { 'Authorization': 'Bearer ' + token },
        muteHttpExceptions: true
      };

      const response = UrlFetchApp.fetch(url, options);
      const data = JSON.parse(response.getContentText());
      const receipts = data.receipts || [];
      cursor = data.cursor || null;

      receipts.forEach(r => {
        if (r.receipt_type === 'SALE') {
          // Store sale line items by receipt
          salesMap[r.receipt_number] = r.line_items.map(item => ({ ...item }));
          netTotalSales += r.total_money || 0;
        } else if (r.receipt_type === 'REFUND') {
          netTotalSales -= r.total_money || 0;
        }
      });

    } while (cursor);

    // Sum net quantities and totals by product
    Object.values(salesMap).forEach(lineItems => {
      lineItems.forEach(item => {
        if (!items[item.item_name]) items[item.item_name] = { quantity: 0, total: 0 };
        items[item.item_name].quantity += item.quantity;      // quantity sold
        items[item.item_name].total += item.total_money;      // total money for that line
      });
    });
    // Round net total sales to 2 decimal places
      netTotalSales = Math.round(netTotalSales * 100) / 100;

    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        totalSales: netTotalSales,
        items: items
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}


function doGet(e) {
  const params = e.parameter || {};
  if (params.action === 'loyverse') {
    // delegate to your existing Loyverse function
    return doGetLoyverseSales(e);
  }
  // Optional: handle other GET actions or return an error
  return ContentService
    .createTextOutput(JSON.stringify({ success: false, error: 'Invalid GET request' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function getNZDateRangeUTC(dateStr) {
  // dateStr is 'YYYY-MM-DD' in NZ local time
  // Returns UTC ISO strings for start and end of the NZ day
  const nzTimeZone = "Pacific/Auckland";

  const startNZ = new Date(`${dateStr}T00:00:00`);
  const endNZ   = new Date(`${dateStr}T23:59:59`);

  // Convert to UTC ISO string accounting for NZ timezone
  const startUTC = Utilities.formatDate(startNZ, nzTimeZone, "yyyy-MM-dd'T'HH:mm:ssXXX");
  const endUTC   = Utilities.formatDate(endNZ, nzTimeZone, "yyyy-MM-dd'T'HH:mm:ssXXX");

  // Convert to plain UTC ISO string (remove offset, as Loyverse expects Z/UTC)
  const startISO = new Date(startUTC).toISOString();
  const endISO   = new Date(endUTC).toISOString();

  return { startISO, endISO };
}

