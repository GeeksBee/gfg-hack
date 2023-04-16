## Getting Started

```
npm i
npm run dev
```

Some Documentation of features required-

PRODUCT MANAGEMENT, FULFILLMENT SYSTEM, STOCK MANAGEMENT AND ACCOUNTING SYSTEM

- User Login
  - Trial login for 1 month
  - Find users creating logins to avoid paying
- Payments (Stripe)
  - Payment required after 1 month of use
  - Payment depends how many stores added, we may chose to charge $1 per store added, or charge 5c per item dispatched.
- Stores Integration (Multiple)
  - Integrate with WooCommerce, Magento, shopify using API
- Pull Orders after Every 5 minutes
  - Automatically check for orders at the integration points
- Pull All product Data
  - Pull products with all attributes
  - Will use product data for linking products to warehouse products and so our system can create xml/csv upload files they can use for merchant center, criteo, fb ads, etc
- Notify the store once Label is created
  - upload tracking information to the order that is being marked as dispatched and mark the order as complete
- Labels and Items management
  - Allow address labels to be created.
- Gift rules
  - Allow custom rules to be created like; if purchase is over $10, add gift X to order
- Shipping rules
  - Allow custom rules to be created like; if order came from ebay, ship with x company or if order contains delivery method ‘express’ text, ship with x company express method
- Delivery Companies integration (Multiple) - AusPost: https://developers.auspost.com.au/apis/shipping-and-tracking/getting-started?iedm=edm-sfmc-shipping_tracking_api_dev_centre_testbed_credentials-getting-started
  - After integration completed, we need to complete the technical validation form to prove to Australia post we have built a working environment; https://developers.auspost.com.au/apis/shipping-and-tracking/info/integration/direct-integration?iedm=edm-sfmc-shipping_tracking_api_dev_centre_testbed_credentials-tech-form
- Hourly check delivery status
  - Start checking hourly after marked as shipped and stop checking once marked as delivered or if it has past 30 days.
  - AusPost: use above url for api information
- Inventory Management (Update Inventory Manually, Automatic Reduction)
- Page for Inventory Data
  - Show list of ecommerce products downloaded from webstore
  - Show list of warehouse products
  - Allow linking webstore products to warehouse products 1:1, 1:2, 1:3, 1:4 product correlation
- Warehouse space allocation and management
  - Allow stock receiving in
  - Minus from stock level when item is marked as dispatched
- Processing Order
  - Note shipping rules
- Delivery Report pages
  - After items are dispatched, every hour the system needs to check current delivery status until it is marked as delivered.
  - We may also use this information to send email to customer showing them how to install the wiper blades.
  - Email rules, use product data attributes to send email to customer, if order product with X attribute, send email 1.
- Accounts Page (Total Revenue from Orders)
- Admin Panel to manage users
  - Allow admin to manage other users and roles
- Admin panel to manage roles
  - Allow admin to create a sales user to see information for some customers
- Admin panel to run revenue report for portal
- Marketing Reports from different Platforms FINAL STAGES
  - Link to google ads, facebook ads, taboola ads, criteo ads, outbrain ads
  - Pull last 30 days of ad spend to run reporting
  - Pull ad creative to find ones that are good performing and bad performing
- Support Ticketing System FINAL STAGES
  - This ticketing system integrates with the customers website, they will link to their sub domain for the ticketing system. For instance bob.central.com
- Additional Features - whenever user login to portal from new device, or first login in 30 days, have it send verification email like this - desktop ap for printing - packing slip
  - now that we know the items linked, it will print the items to pack into the box, this will come out on a different printer, and we discussed windows program to auto print
  - and for linked items, we should be able to assign barcode
  - something that prints on 80mm wide printer
  - so when we develop app, we can scan packing slip, then items we are packing, then label, then it will confirm order is correct .. for instance, if you scan packing label then scan wrong items, it will show alert
    - barcode input form fields - we can have rules for each page, for instance, awaiting process page, rules for this page, if order arrives here, it can auto process, if issue it will land in issue, if successful it will land in pick and pack area and same thing for other areas, if order lands in pick and pack, we can trigger print and dispatch automatically
    - and box rules should be included, so if product has box rule enabled, it will use box rule for its allocated warehouse, so if product belongs to warehouse 1, and rule meets criteria like if product is linked to warehouse items and warehouse is warehouse1, then use this rule, this rule will calculate cbm of goods and suggest correct box to use
    - and all warehouse items should have dimensions linked to them, i might specify dimensions like 5x5x80 for each wiper, so when someone purchases two, it will calculate total as 10x10x80 and then suggest correct box to use based on this information
    - or I might specify box rule to be based on "keyword" qty like if linked product contain
      s more than 2 x products with title "wiper blade" then use box2 and some items like washer tablet dont have size because it’s so small
# frontend
# frontend
# frontend
# EdTechStudentPortal
"# EasyShipAdmin" 
"# EasyShipAdmin" 
