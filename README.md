# Market49
A campus student marketplace for buying and selling student-related items built with HTML, CSS, and JavaScript.

## How to Run Locally
1. Download and unzip the project folder
2. Open the folder in any code editor or file explorer
3. Open `index.html` in your browser by double-clicking it

No server, no install

## Testing Responsive Layout
1. Open any page in Chrome
2. Press `F12` to open DevTools
3. Click the device toggle icon (top left of DevTools)
4. Set width to `375` for mobile view
5. Set width to `1280` for desktop view

## Pages
- `index.html` — Home page with Browse Listings and Post a Listing buttons
- `listings.html` — Browse all listings in a responsive card grid
- `listing-detail.html` — Individual listing view with Add to Cart and Message Seller
- `cart.html` — Cart page with order summary and Proceed to Checkout
- `checkout.html` — Shipping and payment form with order summary sidebar
- `order-confirmed.html` — Order confirmation with Back to Home button
- `post-listing.html` — Post a new listing with full form validation and photo upload
- `manage-listings.html` — Manage your active listings
- `signin.html` — Sign in page with email and password validation

## File Structure
```
Market49/
├── index.html
├── listings.html
├── listing-detail.html
├── cart.html
├── checkout.html
├── order-confirmed.html
├── post-listing.html
├── manage-listings.html
├── signin.html
├── css/
│   └── styles.css        # Single stylesheet for entire site
├── js/
│   └── main.js           # Single script for all behavior
└── assets/
    └── images/           # Add item photos here
```

## Features
- Responsive layout — mobile first, adapts at 375px and 1024px
- Search bar always visible at every screen size
- Dark mode toggle in nav
- Search suggestion dropdown on all pages
- Form validation on post listing, checkout, and sign in
- Photo upload required on post listing
- Font Awesome icons for stars and trash


## Dependencies
- [Google Fonts — Inter](https://fonts.google.com/specimen/Inter)
- [Font Awesome 6.5](https://fontawesome.com) — icons only
