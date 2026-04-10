// ============================================
//   1. Hamburger menu
//   2. Dark mode toggle
//   3. Search dropdown
//   4. Condition buttons (post listing)
//   5. File upload display (post listing)
//   6. Post listing form validation
//   7. Checkout form validation
//   8. Sign in form validation
// ============================================


document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. HAMBURGER MENU
  // Opens and closes the mobile slide-in menu.
  // Runs on every page since nav is everywhere.
  // ==========================================

  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const closeMenu = document.getElementById('close-menu');
  const menuOverlay = document.getElementById('menu-overlay');

  // Open when hamburger is clicked
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      mobileMenu.classList.add('open');
      menuOverlay.classList.add('visible');
      // Lock scroll so page doesn't move behind menu
      document.body.style.overflow = 'hidden';
    });
  }

  // Close when X button is clicked
  if (closeMenu) {
    closeMenu.addEventListener('click', closeNav);
  }

  // Close when the dark overlay is clicked
  if (menuOverlay) {
    menuOverlay.addEventListener('click', closeNav);
  }

  // Close when any menu link is clicked
  // so menu doesn't stay open mid-navigation
  if (mobileMenu) {
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeNav);
    });
  }

  // Resets all menu-related state
  function closeNav() {
    if (mobileMenu) mobileMenu.classList.remove('open');
    if (menuOverlay) menuOverlay.classList.remove('visible');
    document.body.style.overflow = '';
  }

  // ==========================================
  // 2. DARK MODE TOGGLE
  // Flips the .dark class on the body.
  // localStorage saves preference across pages
  // so it stays consistent when navigating.
  // ==========================================

  const toggle = document.getElementById('dark-toggle');

  // Apply saved preference before page renders
  const savedMode = localStorage.getItem('darkMode');
  if (savedMode === 'true') {
    document.body.classList.add('dark');
    if (toggle) toggle.classList.add('active');
  }

  if (toggle) {
    toggle.addEventListener('click', () => {
      document.body.classList.toggle('dark');
      const isDark = document.body.classList.contains('dark');
      // Move the dot and change pill color
      toggle.classList.toggle('active', isDark);
      // Remember for next page
      localStorage.setItem('darkMode', isDark);
    });
  }

 // ==========================================
 // 3. SEARCH — real-time filtering
 // Filters suggestions as user types.
 // Shows no-results message if nothing matches.
 // Clears dropdown when input is empty.
 // ==========================================

 const searchInput = document.getElementById('search-input');
 const dropdown = document.getElementById('search-dropdown');

 // Full list of searchable items
 // In a real app this would come from a database
 const suggestions = [
   'Calculus Textbook',
   'Mechanical Keyboard',
   'Desk Lamp',
   'HDMI Cable',
   'Backpack',
   'Graphing Calculator',
   'Monitor',
   'North Face Backpack',
   'Desk Chair',
   'Laptop Stand'
 ];

 if (searchInput && dropdown) {

   // Fires on every keystroke — not just on focus
   searchInput.addEventListener('input', () => {
     const query = searchInput.value.trim().toLowerCase();

     // If input is empty hide the dropdown completely
     if (query === '') {
       dropdown.classList.remove('visible');
       dropdown.innerHTML = '';
       return;
     }

     // Filter suggestions that contain the typed text
     const matches = suggestions.filter(s =>
       s.toLowerCase().includes(query)
     );

     if (matches.length === 0) {
       // Show no results message
       dropdown.innerHTML = `
         <div class="suggestion no-results">
           No results for "${searchInput.value}"
         </div>`;
     } else {
       // Show matching suggestions
       dropdown.innerHTML = matches
         .map(s => `<div class="suggestion"
           onclick="handleSuggestion('${s}')">${s}</div>`)
         .join('');
     }

     dropdown.classList.add('visible');
   });

   // Hide dropdown when clicking outside the search bar
   document.addEventListener('click', (e) => {
     if (!e.target.closest('.nav-search')) {
       dropdown.classList.remove('visible');
     }
   });

   // Close dropdown on Escape key
   searchInput.addEventListener('keydown', (e) => {
     if (e.key === 'Escape') {
       dropdown.classList.remove('visible');
       searchInput.blur();
     }
   });
 }

  // ==========================================
  // 4. CONDITION BUTTONS — post listing page
  // Pill buttons for New / Like New / Good / Fair.
  // Clicking one moves the green fill to it.
  // ==========================================

  const conditionBtns = document.querySelectorAll('.condition-btn');

  if (conditionBtns.length > 0) {
    conditionBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Remove active from all buttons
        conditionBtns.forEach(b => b.classList.remove('active'));
        // Apply active only to clicked button
        btn.classList.add('active');
      });
    });
  }

  // ==========================================
  // 5. FILE UPLOAD DISPLAY — post listing page
  // Shows selected file name below the upload
  // box and confirms selection with green border.
  // ==========================================

  const fileInput = document.getElementById('file-input');
  const uploadName = document.getElementById('upload-name');
  const uploadBox = document.getElementById('upload-box');
  const photoError = document.getElementById('photo-error');

  if (fileInput) {
    fileInput.addEventListener('change', () => {
      if (fileInput.files.length > 0) {
        // Show the file name
        if (uploadName) {
          uploadName.textContent = fileInput.files[0].name;
        }
        // Green border confirms selection
        if (uploadBox) {
          uploadBox.style.borderColor = 'var(--green)';
        }
        // Clear photo error if one was showing
        if (photoError) {
          photoError.classList.remove('visible');
        }
      } else {
        if (uploadName) uploadName.textContent = '';
        if (uploadBox) uploadBox.style.borderColor = '';
      }
    });
  }

  // ==========================================
  // 6. POST LISTING FORM VALIDATION
  // Checks title, price, photo, and description
  // before allowing navigation to manage page.
  // ==========================================

  const postForm = document.getElementById('post-listing-form');

  if (postForm) {
    postForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Validate text fields
      const titleOk = checkField('title', 'title-error');
      const priceOk = checkField('price', 'price-error');
      const descOk = checkField('description', 'desc-error');

      // Validate photo separately — re-grab elements here
      // because they were defined in a different section above
      const photoFileInput = document.getElementById('file-input');
      const photoUploadBox = document.getElementById('upload-box');
      const photoErrorMsg = document.getElementById('photo-error');

      let photoOk = false;

      if (photoFileInput && photoUploadBox && photoErrorMsg) {
        // All three elements exist — we're on post-listing page
        if (!photoFileInput.files || photoFileInput.files.length === 0) {
          // Nothing uploaded — show red border and error message
          photoErrorMsg.classList.add('visible');
          photoUploadBox.style.borderColor = 'var(--error)';
          photoOk = false;
        } else {
          // Photo selected — clear any error
          photoErrorMsg.classList.remove('visible');
          photoUploadBox.style.borderColor = 'var(--green)';
          photoOk = true;
        }
      } else {
        // Upload elements not on this page — skip photo check
        photoOk = true;
      }

      // Navigate only if all fields passed
      if (titleOk && priceOk && descOk && photoOk) {
        // Show overlay and button spinner
        const overlay = document.getElementById('loading-overlay');
        const submitBtn = postForm.querySelector('[type="submit"]');
        if (overlay) overlay.classList.add('visible');
        if (submitBtn) submitBtn.classList.add('btn-loading');

        setTimeout(() => {
          window.location.href = 'manage-listings.html';
        }, 1500);
      }
    });
  }

  // ==========================================
  // 7. CHECKOUT FORM VALIDATION
  // Checks name, contact, and card number.
  // Navigates to order-confirmed on success.
  // ==========================================

  const checkoutForm = document.getElementById('checkout-form');

  if (checkoutForm) {
    checkoutForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameOk = checkField('full-name', 'name-error');
      const contactOk = checkField('contact', 'contact-error');
      const cardOk = checkField('card-number', 'card-error');

      if (nameOk && contactOk && cardOk) {
        // Show overlay and button spinner
        const overlay = document.getElementById('loading-overlay');
        const submitBtn = checkoutForm.querySelector('[type="submit"]');
        if (overlay) overlay.classList.add('visible');
        if (submitBtn) submitBtn.classList.add('btn-loading');

        setTimeout(() => {
          window.location.href = 'order-confirmed.html';
        }, 1500);
      }
    });
  }

  // ==========================================
  // 8. SIGN IN FORM VALIDATION
  // Checks email and password.
  // Navigates to home on success (simulated login).
  // ==========================================

  const signinForm = document.getElementById('signin-form');

  if (signinForm) {
    signinForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const emailOk = checkField('email', 'email-error');
      const passwordOk = checkField('password', 'password-error');

      if (emailOk && passwordOk) {
        window.location.href = 'index.html';
      }
    });
  }

  // ==========================================
  // SHARED HELPER — checkField
  // Used by all three form validators above.
  // Adds red border and shows error if empty.
  // Clears error if field has content.
  // Returns true if valid, false if empty.
  // ==========================================

  function checkField(inputId, errorId) {
    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);

    // Guard in case element doesn't exist on this page
    if (!input || !error) return true;

    if (!input.value.trim()) {
      input.classList.add('error');
      error.classList.add('visible');
      return false;
    }

    input.classList.remove('error');
    error.classList.remove('visible');
    return true;
  }

  // ==========================================
  // 9. LISTINGS SKELETON → REAL CARDS
  // Shows skeleton placeholders for 1 second,
  // then fades in the real listings grid.
  // ==========================================

  const skeletonGrid = document.getElementById('skeleton-grid');
  const realGrid = document.getElementById('real-grid');

  if (skeletonGrid && realGrid) {
    setTimeout(() => {
      skeletonGrid.style.display = 'none';
      realGrid.style.display = 'grid';
      realGrid.classList.add('fade-in');

      // After real cards are visible, apply any
      // URL search filter that was waiting
      const urlParams = new URLSearchParams(window.location.search);
      const urlQuery = urlParams.get('search');
      if (urlQuery) {
        filterListings(urlQuery);
        if (searchInput) searchInput.value = urlQuery;
      }
    }, 1000);
  }

  // ==========================================
  // LISTINGS PAGE FILTER
  // Reads the search query from the URL and
  // hides cards that don't match on page load.
  // Also filters live as user types on listings page.
  // ==========================================

  function filterListings(query) {
    const cards = document.querySelectorAll('.card[data-name]');
    if (cards.length === 0) return;

    const q = query.toLowerCase().trim();

    cards.forEach(card => {
      const name = card.getAttribute('data-name').toLowerCase();
      // Show card if name contains query, hide if not
      card.style.display = (q === '' || name.includes(q))
        ? 'block' : 'none';
    });
  }

  // Also filter live as user types on listings page
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      filterListings(searchInput.value);
    });
  }

});  // end DOMContentLoaded


// handleSuggestion — called from inline onclick
// in the search dropdown. Defined outside
// DOMContentLoaded so it's globally accessible.
// ============================================
function handleSuggestion(term) {
  window.location.href =
    `listings.html?search=${encodeURIComponent(term)}`;
}