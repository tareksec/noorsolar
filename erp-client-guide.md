# ERP Integration Guide for Client & ERP Developer
# (নূর সোলার এনার্জি ওয়েবসাইট ও লারাভেল ইআরপি ইন্টিগ্রেশন নির্দেশিকা)

এই ডকুমেন্টটি ক্লায়েন্টের **Laravel ERP ডেভেলপমেন্ট টিম** বা সিস্টেম অ্যাডমিনিস্ট্রেটরের জন্য তৈরি করা হয়েছে। ওয়েবসাইট ডেভেলপারের কাছে ERP সিস্টেমের সরাসরি অ্যাক্সেস না থাকায়, ERP টিমের পক্ষ থেকে কী কী পদক্ষেপ গ্রহণ করতে হবে তা নিচে ধাপে ধাপে বিস্তারিতভাবে তুলে ধরা হলো।

---

## ১. ভূমিকা ও আর্কিটেকচার (Overview)

* **ওয়েবসাইট টেক স্ট্যাক:** Next.js 16 (App Router), TypeScript, SQLite (Prisma ORM), Server Actions।
* **ERP প্ল্যাটফর্ম:** কাস্টম Laravel অ্যাপ্লিকেশন (VPS-এ হোস্ট করা)।
* **কমিউনিকেশন মেথড:** উভয়মুখী রিয়েল-টাইম সিঙ্ক (Two-way Real-Time Sync via REST API & Webhook)।
* **ওয়েবসাইট Webhook রিসিভার URL:**
  `https://your-website-domain.com/api/erp/webhook`

---

## ২. ERP টিমের ওয়েব টিমকে যা যা সরবরাহ করতে হবে (Credentials Needed)

ERP টিমকে ওয়েবসাইটের ডেভেলপারের সাথে নিচের ৩টি তথ্য শেয়ার করতে হবে (যা ওয়েবসাইটের `.env` ফাইলে কনফিগার করা হবে):

```env
ERP_API_BASE_URL="https://your-erp-domain.com/api/v1"
ERP_API_KEY="erp_live_bearer_token_here"
ERP_WEBHOOK_SECRET="a_strong_random_secret_for_hmac_sha256"
```

1. **`ERP_API_BASE_URL`**: ERP-এর API রুট URL (যেমন: `https://erp.example.com/api/v1` বা স্টেজিং URL)।
2. **`ERP_API_KEY`**: ওয়েবসাইট থেকে ERP-তে পাঠানো প্রতিটি রিকোয়েস্টে `Authorization: Bearer <TOKEN>` হিসেবে যাবে।
3. **`ERP_WEBHOOK_SECRET`**: ERP থেকে ওয়েবসাইটে Webhook পাঠানোর সময় HMAC-SHA256 সিগনেচার তৈরি করতে ব্যবহৃত সিক্রেট কী।

---

## ৩. ERP সাইডে যে এন্ডপয়েন্টগুলো তৈরি করতে হবে (Incoming from Website)

ওয়েবসাইট থেকে ERP-তে ডাটা পাঠাতে ERP টিমের Laravel অ্যাপ্লিকেশনে নিচের ৩টি API এন্ডপয়েন্ট তৈরি ও রাউট করতে হবে:

### এন্ডপয়েন্ট ১: নতুন কোটেশন গ্রহণ (`POST /api/v1/quotes`)
গ্রাহক ওয়েবসাইটে কোটেশন ফর্ম পূরণ করার সাথে সাথে ওয়েবসাইট রিয়েল-টাইমে এই এন্ডপয়েন্টে ডাটা পাঠায়।

* **Method:** `POST`
* **URL:** `{ERP_API_BASE_URL}/quotes`
* **Headers:**
  ```http
  Authorization: Bearer {ERP_API_KEY}
  Content-Type: application/json
  Accept: application/json
  ```
* **Payload (JSON):**
  ```json
  {
    "website_quote_id": "cm...unique_id",
    "customer_name": "Md. Rahim Chowdhury",
    "company_name": "Rahim Textiles Ltd",
    "phone": "+8801712345678",
    "email": "rahim@example.com",
    "quantity": "500 kWp",
    "delivery_location": "Gazipur Industrial Area",
    "notes": "Buyer Type: EPC Contractor | Target Delivery: 2026-10-15\n\nNotes: Need Tier-1 panels with warranty certificate",
    "source": "WEBSITE_NOOR_SOLAR",
    "created_at": "2026-09-28T05:30:00.000Z",
    "product": {
      "id": "cm...prod_id",
      "name": "620W N-Type TOPCon Solar Panel",
      "model": "NS-620TOP",
      "erp_product_id": null
    }
  }
  ```
* **Expected Response from ERP (HTTP 200/201):**
  ```json
  {
    "success": true,
    "id": "ERP-QUOTE-84920",
    "message": "Quote request successfully entered into ERP lead system"
  }
  ```

---

### এন্ডপয়েন্ট ২: প্রোডাক্ট সিঙ্ক গ্রহণ (`POST /api/v1/products/sync`)
ওয়েবসাইটের অ্যাডমিন প্যানেল থেকে কোনো প্রোডাক্ট এডিট বা তৈরি করা হলে ERP-তে অটো সিঙ্ক হয়।

* **Method:** `POST`
* **URL:** `{ERP_API_BASE_URL}/products/sync`
* **Headers:**
  ```http
  Authorization: Bearer {ERP_API_KEY}
  Content-Type: application/json
  ```
* **Payload (JSON):**
  ```json
  {
    "website_product_id": "cm...prod_id",
    "erp_product_id": "ERP-PANEL-01",
    "slug": "620w-n-type-topcon",
    "name": "620W N-Type TOPCon Solar Panel",
    "brand": "Noor Solar",
    "model": "NS-620TOP",
    "price_bdt": 16500,
    "stock_status": "IN_STOCK",
    "show_price": true,
    "updated_at": "2026-09-28T05:40:00.000Z"
  }
  ```
* **Expected Response (HTTP 200):**
  ```json
  { "success": true }
  ```

---

### এন্ডপয়েন্ট ৩: কোটেশন স্ট্যাটাস আপডেট গ্রহণ (`POST /api/v1/quotes/status`)
ওয়েবসাইটের অ্যাডমিন প্যানেল থেকে কোনো কোটেশনের স্ট্যাটাস চেঞ্জ করলে ERP-কে অবহিত করা হয়।

* **Method:** `POST`
* **URL:** `{ERP_API_BASE_URL}/quotes/status`
* **Payload (JSON):**
  ```json
  {
    "website_quote_id": "cm...quote_id",
    "erp_quote_id": "ERP-QUOTE-84920",
    "status": "CONTACTED",
    "note": "Sales engineer called the client and sent technical catalog",
    "updated_at": "2026-09-28T05:45:00.000Z"
  }
  ```
* **Expected Response (HTTP 200):**
  ```json
  { "success": true }
  ```

---

## ৪. ERP থেকে ওয়েবসাইটে Webhook পাঠানোর নিয়ম (Outgoing from ERP)

ERP-তে স্টক, দাম, কিংবা অর্ডার/শিপমেন্ট স্ট্যাটাস পরিবর্তন হলে সাথে সাথে ওয়েবসাইটের Webhook এন্ডপয়েন্টে POST রিকোয়েস্ট পাঠাতে হবে।

* **ওয়েবসাইট Webhook এন্ডপয়েন্ট:**
  `https://your-website-domain.com/api/erp/webhook`

* **রিকোয়েস্ট হেডার (যেকোনো একটি পদ্ধতি গ্রহণযোগ্য):**
  * **পদ্ধতি ক (প্রস্তাবিত HMAC Signature):**
    `X-ERP-Signature: <hmac_sha256_hash>`
    *(লারাভেলে: `hash_hmac('sha256', $rawJsonBody, $ERP_WEBHOOK_SECRET)`)*
  * **পদ্ধতি খ (Bearer Token):**
    `Authorization: Bearer {ERP_WEBHOOK_SECRET}`

---

### ইভেন্ট ১: ERP থেকে স্টক বা দাম পরিবর্তন হলে (`product.updated`)
ERP-তে যখন কোনো আইটেমের ইনভেন্টরি, রেট বা স্টক স্ট্যাটাস আপডেট হবে:

* **Webhook Payload (Single Item):**
  ```json
  {
    "event": "product.updated",
    "data": {
      "product_id": "cm...prod_id",
      "erp_product_id": "ERP-ITEM-101",
      "model": "NS-620TOP",
      "price_bdt": 16200,
      "stock_status": "IN_STOCK",
      "show_price": true
    }
  }
  ```

* **স্টক স্ট্যাটাস ভ্যালুসমূহ (স্বীকৃত মান):**
  * `"IN_STOCK"` (অথবা `"stock_qty": 50`)
  * `"INCOMING"` (ট্রানজিটে থাকা বা প্রি-অর্ডার)
  * `"ON_REQUEST"` (স্টক শেষ বা যোগাযোগের অনুরোধ)

* **Webhook Payload (Bulk / একাধিক প্রোডাক্ট একসাথে):**
  ```json
  {
    "event": "inventory.bulk_update",
    "data": [
      {
        "model": "NS-620TOP",
        "price_bdt": 16200,
        "stock_status": "IN_STOCK"
      },
      {
        "model": "INV-10KW-PRO",
        "price_bdt": 145000,
        "stock_status": "INCOMING"
      }
    ]
  }
  ```

---

### ইভেন্ট ২: ERP থেকে কোটেশন বা শিপমেন্ট ট্র্যাকিং স্ট্যাটাস আপডেট (`quote.status_updated`)
ERP-তে কোনো কোটেশনের স্ট্যাটাস চেঞ্জ হলে বা প্রোডাকশন/শিপমেন্ট ট্র্যাকিং শুরু হলে:

* **Webhook Payload:**
  ```json
  {
    "event": "quote.status_updated",
    "data": {
      "quote_id": "cm...website_quote_id",
      "erp_quote_id": "ERP-ORD-2026-09",
      "status": "CONTACTED",
      "tracking_status": "In Assembly - Factory Unit 2",
      "tracking_number": "TRK-SA-89210",
      "note": "Advance payment received, panel testing completed"
    }
  }
  ```

* **ফিল্ড পরিচিতি:**
  * `quote_id`: ওয়েবসাইটের মূল কোটেশন আইডি।
  * `erp_quote_id`: ERP-এর অর্ডার বা কোটেশন আইডি।
  * `status`: `"NEW"` | `"CONTACTED"` | `"CLOSED"`.
  * `tracking_status`: গ্রাহকের সুবিধার্থে লাইভ স্ট্যাটাস (যেমন: `In Production`, `Quality Testing`, `Dispatched`, `Delivered`).
  * `tracking_number`: চালান নম্বর বা কুরিয়ার ট্র্যাকিং কোড।

---

## ৫. Laravel ERP ডেভেলপারদের জন্য নমুনা কোড (PHP Examples)

### ক. Laravel Controller (ওয়েবসাইট থেকে কোটেশন রিসিভ করার জন্য)
ফাইল: `app/Http/Controllers/Api/WebsiteQuoteController.php`

```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class WebsiteQuoteController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'website_quote_id'  => 'required|string',
            'customer_name'     => 'required|string',
            'phone'             => 'required|string',
            'company_name'      => 'nullable|string',
            'email'             => 'nullable|email',
            'quantity'          => 'nullable|string',
            'delivery_location' => 'nullable|string',
            'notes'             => 'nullable|string',
            'product'           => 'nullable|array',
        ]);

        // ১. ERP ডাটাবেজে লিড/কোটেশন সেভ করুন
        // $quote = \App\Models\ErpQuote::create([ ... ]);
        $generatedErpId = "ERP-QUOTE-" . rand(10000, 99999);

        Log::info("New lead received from website: " . $validated['website_quote_id']);

        // ২. রেসপন্স ফেরত দিন (যাতে ওয়েবসাইট রেফারেন্স আইডি স্টোর করতে পারে)
        return response()->json([
            'success' => true,
            'id'      => $generatedErpId,
            'message' => 'Quote recorded in ERP successfully'
        ], 201);
    }
}
```

---

### খ. Laravel Webhook Sender Service (ওয়েবসাইটে ডাটা পাঠানোর জন্য)
ফাইল: `app/Services/WebsiteWebhookService.php`

```php
<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class WebsiteWebhookService
{
    protected string $webhookUrl;
    protected string $secretKey;

    public function __construct()
    {
        $this->webhookUrl = config('services.website.webhook_url', 'https://your-domain.com/api/erp/webhook');
        $this->secretKey = config('services.website.webhook_secret', 'your_erp_webhook_secret_here');
    }

    /**
     * ERP থেকে প্রোডাক্ট স্টক বা প্রাইস ওয়েবসাইটে পাঠানো
     */
    public function syncProductUpdate(string $modelOrId, int $priceBdt, string $stockStatus)
    {
        $payload = [
            'event' => 'product.updated',
            'data'  => [
                'model'        => $modelOrId,
                'price_bdt'    => $priceBdt,
                'stock_status' => $stockStatus, // IN_STOCK | INCOMING | ON_REQUEST
                'show_price'   => true,
            ]
        ];

        return $this->sendWebhook($payload);
    }

    /**
     * ERP থেকে কোটেশন বা শিপমেন্ট ট্র্যাকিং স্ট্যাটাস ওয়েবসাইটে পাঠানো
     */
    public function syncQuoteStatus(string $websiteQuoteId, string $erpQuoteId, string $status, string $trackingStatus = null, string $trackingNumber = null)
    {
        $payload = [
            'event' => 'quote.status_updated',
            'data'  => [
                'quote_id'        => $websiteQuoteId,
                'erp_quote_id'    => $erpQuoteId,
                'status'          => $status, // NEW | CONTACTED | CLOSED
                'tracking_status' => $trackingStatus,
                'tracking_number' => $trackingNumber,
            ]
        ];

        return $this->sendWebhook($payload);
    }

    /**
     * Webhook প্রেরণ ও HMAC-SHA256 সিগনেচার সংযুক্তকরণ
     */
    protected function sendWebhook(array $payload)
    {
        $rawJson = json_encode($payload);
        $signature = hash_hmac('sha256', $rawJson, $this->secretKey);

        try {
            $response = Http::withHeaders([
                'Content-Type'    => 'application/json',
                'X-ERP-Signature' => $signature,
            ])->timeout(8)->post($this->webhookUrl, $payload);

            if ($response->successful()) {
                Log::info("Webhook successfully delivered to Noor Solar website: " . $payload['event']);
                return true;
            }

            Log::error("Website Webhook error: " . $response->status() . " - " . $response->body());
            return false;
        } catch (\Exception $e) {
            Log::error("Failed to connect to website webhook: " . $e->getMessage());
            return false;
        }
    }
}
```

---

## ৬. টেস্ট করার জন্য cURL ও Postman কমান্ড

### ১. Webhook কানেকশন চেক (Ping):
```bash
curl -X POST https://your-website-domain.com/api/erp/webhook \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_erp_webhook_secret_here" \
  -d '{"event": "ping"}'
```
**প্রত্যাশিত রেসপন্স:**
```json
{
  "success": true,
  "message": "Pong! Noor Solar ERP Webhook is successfully connected."
}
```

### ২. স্টক আপডেট টেস্ট:
```bash
curl -X POST https://your-website-domain.com/api/erp/webhook \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_erp_webhook_secret_here" \
  -d '{
    "event": "product.updated",
    "data": {
      "model": "NS-620TOP",
      "price_bdt": 16500,
      "stock_status": "IN_STOCK"
    }
  }'
```

### ৩. কোটেশন স্ট্যাটাস আপডেট টেস্ট:
```bash
curl -X POST https://your-website-domain.com/api/erp/webhook \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_erp_webhook_secret_here" \
  -d '{
    "event": "quote.status_updated",
    "data": {
      "quote_id": "YOUR_WEBSITE_QUOTE_ID",
      "erp_quote_id": "ERP-ORD-902",
      "status": "CONTACTED",
      "tracking_status": "Factory Production Completed - Ready to Dispatch",
      "tracking_number": "TRK-2026-BD"
    }
  }'
```

---

## ৭. চেক-লিস্ট (ERP টিমের করণীয় সারসংক্ষেপ)

- [ ] ১. ওয়েব ডেভেলপারকে `ERP_API_BASE_URL`, `ERP_API_KEY` ও `ERP_WEBHOOK_SECRET` প্রদান করা।
- [ ] ২. Laravel ERP-তে `POST /quotes` এন্ডপয়েন্ট চালু করা।
- [ ] ৩. Laravel ERP-তে স্টক বা দাম পরিবর্তন হলে ওয়েবসাইটের `POST /api/erp/webhook`-এ `product.updated` ইভেন্ট ট্রিগার করা।
- [ ] ৪. অর্ডার বা লিড প্রগ্রেস হলে `quote.status_updated` ইভেন্ট ট্রিগার করা।
