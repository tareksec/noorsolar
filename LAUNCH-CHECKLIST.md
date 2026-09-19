# NOOR SOLAR ENERGY — PRE-LAUNCH OWNER CHECKLIST

This checklist must be reviewed and executed by the business owner before publicly directing traffic to `noorsolaren.com`.

---

## 1. Replace or Hide Sample Content (Mandatory Before Public Launch)

The database currently contains sample placeholder trust content and demo products. Replace each item with authentic commercial details, or set `HIDE_SAMPLE_CONTENT=true` in your `.env` file to suppress unverified items from public view.

### A. Business Statistics (4 items)
Direct Admin Link: [Admin Content Stats](/admin/content/stats)
- [ ] **Years in business** (Current: `8+` | ID: `cmu8j1p2b00chtekcl50j6q70`) — Update with real company founding timeline or set inactive.
- [ ] **Projects supplied** (Current: `250+` | ID: `cmu8j1p3s00citekcwyblq9er`) — Update with verified commercial deliveries count.
- [ ] **Happy clients** (Current: `180+` | ID: `cmu8j1p4d00cjtekc64uhf46y`) — Update with active corporate client count.
- [ ] **Success rate** (Current: `98%` | ID: `cmu8j1p4p00cktekchxamghah`) — Update with equipment uptime / satisfaction benchmark.

### B. Certifications & Compliance (4 items)
Direct Admin Link: [Admin Content Certifications](/admin/content/certifications)
- [ ] **Quality management certificate** (Issuer: `Standard Inspection Board` | ID: `cmu8j1p5000cltekcorrnenum`) — Upload real ISO 9001 / IEC compliance certificate scan.
- [ ] **Product testing certificate** (Issuer: `Accredited Laboratory` | ID: `cmu8j1p5f00cmtekcfidlgoxw`) — Upload real TUV / Flash Test certification document.
- [ ] **Safety compliance certificate** (Issuer: `Safety Standards Authority` | ID: `cmu8j1p6t00cntekckt26kqnq`) — Upload CE / BSTI clearance document.
- [ ] **Trade license** (Issuer: `Municipal Corporation` | ID: `cmu8j1p7700cotekcmpdg6893`) — Upload verified Dhaka City Corporation trade license.

### C. Partner & Client Brands (6 items)
Direct Admin Link: [Admin Content Partners](/admin/content/partners)
- [ ] **Partner company 1** (ID: `cmu8j1p7i00cptekc3005qdf5`) — Replace with authorized manufacturer or corporate EPC logo.
- [ ] **Partner company 2** (ID: `cmu8j1p7x00cqtekc92fb1ryp`) — Replace with authorized manufacturer or corporate EPC logo.
- [ ] **Partner company 3** (ID: `cmu8j1p8900crtekcihrvjfex`) — Replace with authorized manufacturer or corporate EPC logo.
- [ ] **Partner company 4** (ID: `cmu8j1p8r00cstekczxvcm8x6`) — Replace with authorized manufacturer or corporate EPC logo.
- [ ] **Partner company 5** (ID: `cmu8j1p9300cttekc4nfkgrn6`) — Replace with authorized manufacturer or corporate EPC logo.
- [ ] **Partner company 6** (ID: `cmu8j1p9d00cutekcuj4frdvt`) — Replace with authorized manufacturer or corporate EPC logo.

### D. Client Testimonials (3 items)
Direct Admin Link: [Admin Content Testimonials](/admin/content/testimonials)
- [ ] **Sample customer** (Company: `Sample company 1` | ID: `cmu8j1pa000cvtekcdu4o0qb4`) — Replace with genuine contractor quote.
- [ ] **Sample customer** (Company: `Sample EPC Ltd` | ID: `cmu8j1pae00cwtekcpwhdmaov`) — Replace with genuine industrial client quote.
- [ ] **Sample customer** (Company: `Sample Power Solutions` | ID: `cmu8j1pap00cxtekcieuo15qi`) — Replace with genuine commercial quote.

### E. Frequently Asked Questions (6 items)
Direct Admin Link: [Admin Content FAQ](/admin/content/faq)
- [ ] Review and customize answers to reflect your exact ordering terms, payment LC terms, and warehouse loading procedures.

### F. Demo Catalog Products (15 items)
Direct Admin Link: [Admin Products Manager](/admin/products)
- [ ] Review the 15 pre-seeded products (`N-Type TOPCon Bifacial 620W`, `48V 100Ah LiFePO4`, `10kW Hybrid Inverter`, etc.).
- [ ] Toggle to **Inactive** any models not currently in inventory or available for indent.
- [ ] Update real BDT pricing, minimum order quantities (MOQ), and attach real manufacturer PDF datasheets.

---

## 2. Brand Assets & Visual Identity
- [ ] **Official Company Logo:** Replace placeholder Sun icon with official high-resolution vector SVG or transparent PNG logo.
- [ ] **Facility & Warehouse Photography:** Upload real photos of your Dhaka central warehouse, incoming container unboxings, and palletized stock.

---

## 3. Commercial Contact Details Verification
Direct Admin Link: [Admin Site Settings](/admin/settings)
- [ ] **Primary Hotline:** Set active phone number for incoming wholesale orders.
- [ ] **WhatsApp Commercial Desk:** Verify WhatsApp number (with international country code format `8801...`) for instant quotation chats.
- [ ] **Corporate Email:** Set verified email (`info@noorsolaren.com` or `sales@noorsolaren.com`).
- [ ] **Warehouse & Office Address:** Confirm exact room/floor/building location in Motijheel, Dhaka for commercial pickups.
- [ ] **Operating Hours:** Confirm warehouse receiving and pickup hours.

---

## 4. Admin Security & Access Control
- [ ] **Change Admin Password Immediately:**
  Visit [Admin Password Settings](/admin/settings/password) and set a secure passphrase of at least 12 characters combining uppercase, lowercase, numbers, and symbols.
- [ ] **Verify Rate Limiting:** Attempt repeated bad logins to confirm security lockout is active.
- [ ] **Test Admin Logout:** Verify clicking Logout from any admin view destroys the session and redirects to `/admin/login`.

---

## 5. End-to-End Verification
- [ ] **Public Quote Submission:**
  Submit a test quotation request from the website front-end (home page or product detail page).
- [ ] **Admin Quote Processing:**
  Check [Admin Quote Inbox](/admin/quotes) to verify receipt, change status from `NEW` to `CONTACTED`, add internal notes, and click **Export All CSV** to confirm reporting works.
- [ ] **Product Upload Test:**
  Create a new product with 3 uploaded photos in [New Product](/admin/products/new) and verify it appears on the public catalog.
- [ ] **Check `HIDE_SAMPLE_CONTENT` Flag:**
  If any sample item cannot be verified before launch date, set `HIDE_SAMPLE_CONTENT=true` in server `.env` to prevent unverified claims from appearing to public visitors.
