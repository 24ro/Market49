// ============================================
//   1. Hamburger menu
//   2. Dark mode toggle
//   3. Search dropdown
//   4. Condition buttons (post listing)
//   5. File upload display (post listing)
//   6. Post listing form validation
//   7. Checkout form validation
//   8. Sign in form validation
//   9. Listings skeleton → real cards
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

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      mobileMenu.classList.add('open');
      menuOverlay.classList.add('visible');
      document.body.style.overflow = 'hidden';
    });
  }

  if (closeMenu) {
    closeMenu.addEventListener('click', closeNav);
  }

  if (menuOverlay) {
    menuOverlay.addEventListener('click', closeNav);
  }

  if (mobileMenu) {
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeNav);
    });
  }

  function closeNav() {
    if (mobileMenu) mobileMenu.classList.remove('open');
    if (menuOverlay) menuOverlay.classList.remove('visible');
    document.body.style.overflow = '';
  }

  // ==========================================
  // 2. DARK MODE TOGGLE
  // Flips the .dark class on the body.
  // localStorage saves preference across pages.
  // ==========================================

  const toggle = document.getElementById('dark-toggle');

  const savedMode = localStorage.getItem('darkMode');
  if (savedMode === 'true') {
    document.body.classList.add('dark');
    if (toggle) toggle.classList.add('active');
  }

  if (toggle) {
    toggle.addEventListener('click', () => {
      document.body.classList.toggle('dark');
      const isDark = document.body.classList.contains('dark');
      toggle.classList.toggle('active', isDark);
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

    searchInput.addEventListener('input', () => {
      const query = searchInput.value.trim().toLowerCase();

      if (query === '') {
        dropdown.classList.remove('visible');
        dropdown.innerHTML = '';
        return;
      }

      const matches = suggestions.filter(s =>
        s.toLowerCase().includes(query)
      );

      if (matches.length === 0) {
        dropdown.innerHTML = `
          <div class="suggestion no-results">
            No results for "${searchInput.value}"
          </div>`;
      } else {
        dropdown.innerHTML = matches
          .map(s => `<div class="suggestion"
            onclick="handleSuggestion('${s}')">${s}</div>`)
          .join('');
      }

      dropdown.classList.add('visible');
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.nav-search')) {
        dropdown.classList.remove('visible');
      }
    });

    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        dropdown.classList.remove('visible');
        searchInput.blur();
      }
    });
  }

  // ==========================================
  // 4. CONDITION BUTTONS — post listing page
  // ==========================================

  const conditionBtns = document.querySelectorAll('.condition-btn');

  if (conditionBtns.length > 0) {
    conditionBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        conditionBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });
  }

  // ==========================================
  // 5. FILE UPLOAD DISPLAY — post listing page
  // ==========================================

  const fileInput = document.getElementById('file-input');
  const uploadName = document.getElementById('upload-name');
  const uploadBox = document.getElementById('upload-box');
  const photoError = document.getElementById('photo-error');

  if (fileInput) {
    fileInput.addEventListener('change', () => {
      if (fileInput.files.length > 0) {
        if (uploadName) uploadName.textContent = fileInput.files[0].name;
        if (uploadBox) uploadBox.style.borderColor = 'var(--green)';
        if (photoError) photoError.classList.remove('visible');
      } else {
        if (uploadName) uploadName.textContent = '';
        if (uploadBox) uploadBox.style.borderColor = '';
      }
    });
  }

  // ==========================================
  // 6. POST LISTING FORM — real-time validation
  // Validates on blur and input, not just submit.
  // Each field has specific error messages.
  // Success state shown when field is correct.
  // ==========================================

  const postForm = document.getElementById('post-listing-form');

  if (postForm) {

    // Title — required, min 3 characters
    const titleInput = document.getElementById('title');
    if (titleInput) {
      titleInput.addEventListener('blur', () => {
        validateTitle();
      });
      titleInput.addEventListener('input', () => {
        // Clear error as soon as user starts fixing it
        if (titleInput.value.trim().length >= 3) {
          setSuccess(titleInput, 'title-error', 'title-success');
        }
      });
    }

    function validateTitle() {
      const titleInput = document.getElementById('title');
      const val = titleInput.value.trim();
      if (val === '') {
        setError(titleInput, 'title-error', 'Title is required');
        return false;
      }
      if (val.length < 3) {
        setError(titleInput, 'title-error',
          'Title must be at least 3 characters');
        return false;
      }
      setSuccess(titleInput, 'title-error', 'title-success');
      return true;
    }

    // Price — required, must be a number greater than 0
    const priceInput = document.getElementById('price');
    if (priceInput) {
      priceInput.addEventListener('blur', () => {
        validatePrice();
      });
      priceInput.addEventListener('input', () => {
        const val = parseFloat(priceInput.value);
        if (!isNaN(val) && val > 0) {
          setSuccess(priceInput, 'price-error', 'price-success');
        }
      });
    }

    function validatePrice() {
      const priceInput = document.getElementById('price');
      const val = priceInput.value.trim();
      if (val === '') {
        setError(priceInput, 'price-error', 'Price is required');
        return false;
      }
      if (isNaN(parseFloat(val))) {
        setError(priceInput, 'price-error',
          'Please enter a valid price');
        return false;
      }
      if (parseFloat(val) <= 0) {
        setError(priceInput, 'price-error',
          'Price must be greater than $0');
        return false;
      }
      setSuccess(priceInput, 'price-error', 'price-success');
      return true;
    }

    // Description — required, min 20 characters
    // Shows live character count as user types
    const descInput = document.getElementById('description');
    const descCounter = document.getElementById('desc-counter');
    if (descInput) {
      descInput.addEventListener('blur', () => {
        validateDescription();
      });
      descInput.addEventListener('input', () => {
        const len = descInput.value.trim().length;
        // Update live character counter
        if (descCounter) {
          descCounter.textContent = `${len} / 20 minimum`;
          descCounter.style.color = len >= 20
            ? 'var(--success)' : 'var(--text-secondary)';
        }
        if (len >= 20) {
          setSuccess(descInput, 'desc-error', 'desc-success');
        }
      });
    }

    function validateDescription() {
      const descInput = document.getElementById('description');
      const val = descInput.value.trim();
      if (val === '') {
        setError(descInput, 'desc-error', 'Description is required');
        return false;
      }
      if (val.length < 20) {
        setError(descInput, 'desc-error',
          'Description must be at least 20 characters');
        return false;
      }
      setSuccess(descInput, 'desc-error', 'desc-success');
      return true;
    }

    // Submit — runs all validators one final time
    postForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const titleOk = validateTitle();
      const priceOk = validatePrice();
      const descOk = validateDescription();

      // Photo validation
      const photoFileInput = document.getElementById('file-input');
      const photoUploadBox = document.getElementById('upload-box');
      const photoErrorMsg = document.getElementById('photo-error');
      let photoOk = false;

      if (photoFileInput && photoUploadBox && photoErrorMsg) {
        if (!photoFileInput.files || photoFileInput.files.length === 0) {
          photoErrorMsg.classList.add('visible');
          photoUploadBox.style.borderColor = 'var(--error)';
          photoOk = false;
        } else {
          photoErrorMsg.classList.remove('visible');
          photoUploadBox.style.borderColor = 'var(--green)';
          photoOk = true;
        }
      } else {
        photoOk = true;
      }

      if (titleOk && priceOk && descOk && photoOk) {
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
  // 7. CHECKOUT FORM — real-time validation
  // Validates name, contact, card, expiry, CVC.
  // Auto-formats card number and expiry as typed.
  // ==========================================

  const checkoutForm = document.getElementById('checkout-form');

  if (checkoutForm) {

    // Full name — required, must have two words
    const nameInput = document.getElementById('full-name');
    if (nameInput) {
      nameInput.addEventListener('blur', () => validateName());
      nameInput.addEventListener('input', () => {
        if (nameInput.value.trim().split(' ').filter(w =>
          w.length > 0).length >= 2) {
          setSuccess(nameInput, 'name-error', 'name-success');
        }
      });
    }

    function validateName() {
      const nameInput = document.getElementById('full-name');
      const val = nameInput.value.trim();
      if (val === '') {
        setError(nameInput, 'name-error', 'Full name is required');
        return false;
      }
      const words = val.split(' ').filter(w => w.length > 0);
      if (words.length < 2) {
        setError(nameInput, 'name-error',
          'Please enter your first and last name');
        return false;
      }
      setSuccess(nameInput, 'name-error', 'name-success');
      return true;
    }

    // Contact — required, must be valid email or 10 digit phone
    const contactInput = document.getElementById('contact');
    if (contactInput) {
      contactInput.addEventListener('blur', () => validateContact());
      contactInput.addEventListener('input', () => {
        if (isValidEmail(contactInput.value) ||
            isValidPhone(contactInput.value)) {
          setSuccess(contactInput, 'contact-error', 'contact-success');
        }
      });
    }

    function isValidEmail(val) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    }

    function isValidPhone(val) {
      return val.replace(/[\s\-\(\)]/g, '').length === 10 &&
        /^\d+$/.test(val.replace(/[\s\-\(\)]/g, ''));
    }

    function validateContact() {
      const contactInput = document.getElementById('contact');
      const val = contactInput.value.trim();
      if (val === '') {
        setError(contactInput, 'contact-error',
          'Phone or email is required');
        return false;
      }
      if (!isValidEmail(val) && !isValidPhone(val)) {
        setError(contactInput, 'contact-error',
          'Please enter a valid email or 10-digit phone number');
        return false;
      }
      setSuccess(contactInput, 'contact-error', 'contact-success');
      return true;
    }

    // Card number — required, must be 16 digits
    // Auto-formats as 1234 5678 9012 3456
    const cardInput = document.getElementById('card-number');
    if (cardInput) {
      cardInput.addEventListener('input', () => {
        // Strip non-digits then add spaces every 4 digits
        let val = cardInput.value.replace(/\D/g, '').slice(0, 16);
        cardInput.value = val.replace(/(.{4})/g, '$1 ').trim();
        if (val.length === 16) {
          setSuccess(cardInput, 'card-error', 'card-success');
        } else {
          clearState(cardInput, 'card-error', 'card-success');
        }
      });
      cardInput.addEventListener('blur', () => validateCard());
    }

    function validateCard() {
      const cardInput = document.getElementById('card-number');
      const digits = cardInput.value.replace(/\D/g, '');
      if (digits === '') {
        setError(cardInput, 'card-error', 'Card number is required');
        return false;
      }
      if (digits.length !== 16) {
        setError(cardInput, 'card-error',
          'Card number must be 16 digits');
        return false;
      }
      setSuccess(cardInput, 'card-error', 'card-success');
      return true;
    }

    // Expiry — required, must be MM/YY format
    // Auto-inserts / after 2 digits
    const expiryInput = document.getElementById('expiry');
    if (expiryInput) {
      expiryInput.addEventListener('input', () => {
        let val = expiryInput.value.replace(/\D/g, '').slice(0, 4);
        if (val.length >= 3) {
          val = val.slice(0, 2) + '/' + val.slice(2);
        }
        expiryInput.value = val;
        if (val.length === 5) {
          setSuccess(expiryInput, 'expiry-error', 'expiry-success');
        } else {
          clearState(expiryInput, 'expiry-error', 'expiry-success');
        }
      });
      expiryInput.addEventListener('blur', () => validateExpiry());
    }

    function validateExpiry() {
      const expiryInput = document.getElementById('expiry');
      const val = expiryInput.value.trim();
      if (val === '') {
        setError(expiryInput, 'expiry-error',
          'Expiration date is required');
        return false;
      }
      if (!/^\d{2}\/\d{2}$/.test(val)) {
        setError(expiryInput, 'expiry-error',
          'Please use MM/YY format');
        return false;
      }
      setSuccess(expiryInput, 'expiry-error', 'expiry-success');
      return true;
    }

    // CVC — required, must be 3 digits
    const cvcInput = document.getElementById('cvc');
    if (cvcInput) {
      cvcInput.addEventListener('input', () => {
        // Only allow digits, max 3
        cvcInput.value = cvcInput.value.replace(/\D/g, '').slice(0, 3);
        if (cvcInput.value.length === 3) {
          setSuccess(cvcInput, 'cvc-error', 'cvc-success');
        } else {
          clearState(cvcInput, 'cvc-error', 'cvc-success');
        }
      });
      cvcInput.addEventListener('blur', () => validateCVC());
    }

    function validateCVC() {
      const cvcInput = document.getElementById('cvc');
      const val = cvcInput.value.trim();
      if (val === '') {
        setError(cvcInput, 'cvc-error', 'CVC is required');
        return false;
      }
      if (val.length !== 3 || isNaN(val)) {
        setError(cvcInput, 'cvc-error', 'CVC must be 3 digits');
        return false;
      }
      setSuccess(cvcInput, 'cvc-error', 'cvc-success');
      return true;
    }

    // Submit — runs all validators one final time
    checkoutForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameOk = validateName();
      const contactOk = validateContact();
      const cardOk = validateCard();
      const expiryOk = validateExpiry();
      const cvcOk = validateCVC();

      if (nameOk && contactOk && cardOk && expiryOk && cvcOk) {
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
  // 8. SIGN IN FORM — real-time validation
  // Validates email format and password length.
  // Confirm password must match password.
  // ==========================================

  const signinForm = document.getElementById('signin-form');

  if (signinForm) {

    // Email — required, must be valid format
    const emailInput = document.getElementById('email');
    if (emailInput) {
      emailInput.addEventListener('blur', () => validateEmail());
      emailInput.addEventListener('input', () => {
        if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)) {
          setSuccess(emailInput, 'email-error', 'email-success');
        }
      });
    }

    function validateEmail() {
      const emailInput = document.getElementById('email');
      const val = emailInput.value.trim();
      if (val === '') {
        setError(emailInput, 'email-error', 'Email is required');
        return false;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
        setError(emailInput, 'email-error',
          'Please enter a valid email address');
        return false;
      }
      setSuccess(emailInput, 'email-error', 'email-success');
      return true;
    }

    // Password — required, min 8 characters
    const passwordInput = document.getElementById('password');
    if (passwordInput) {
      passwordInput.addEventListener('blur', () => validatePassword());
      passwordInput.addEventListener('input', () => {
        const len = passwordInput.value.length;
        // Show live strength feedback
        const counter = document.getElementById('password-counter');
        if (counter) {
          counter.textContent = len < 8
            ? `${len}/8 characters minimum`
            : 'Strong enough ✓';
          counter.style.color = len >= 8
            ? 'var(--success)' : 'var(--text-secondary)';
        }
        if (len >= 8) {
          setSuccess(passwordInput, 'password-error',
            'password-success');
        }
        // Re-check confirm password if it has a value
        const confirmInput =
          document.getElementById('confirm-password');
        if (confirmInput && confirmInput.value.length > 0) {
          validateConfirmPassword();
        }
      });
    }

    function validatePassword() {
      const passwordInput = document.getElementById('password');
      const val = passwordInput.value;
      if (val === '') {
        setError(passwordInput, 'password-error',
          'Password is required');
        return false;
      }
      if (val.length < 8) {
        setError(passwordInput, 'password-error',
          'Password must be at least 8 characters');
        return false;
      }
      setSuccess(passwordInput, 'password-error', 'password-success');
      return true;
    }

    // Confirm password — must match password field
    const confirmInput = document.getElementById('confirm-password');
    if (confirmInput) {
      confirmInput.addEventListener('blur', () =>
        validateConfirmPassword());
      confirmInput.addEventListener('input', () => {
        const passwordInput = document.getElementById('password');
        if (confirmInput.value === passwordInput.value &&
            confirmInput.value.length > 0) {
          setSuccess(confirmInput, 'confirm-password-error',
            'confirm-password-success');
        } else if (confirmInput.value.length > 0) {
          setError(confirmInput, 'confirm-password-error',
            'Passwords do not match');
        }
      });
    }

    function validateConfirmPassword() {
      const confirmInput = document.getElementById('confirm-password');
      const passwordInput = document.getElementById('password');
      if (!confirmInput) return true;
      const val = confirmInput.value;
      if (val === '') {
        setError(confirmInput, 'confirm-password-error',
          'Please confirm your password');
        return false;
      }
      if (val !== passwordInput.value) {
        setError(confirmInput, 'confirm-password-error',
          'Passwords do not match');
        return false;
      }
      setSuccess(confirmInput, 'confirm-password-error',
        'confirm-password-success');
      return true;
    }

    // Submit — runs all validators one final time
    signinForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const emailOk = validateEmail();
      const passwordOk = validatePassword();
      const confirmOk = validateConfirmPassword();

      if (emailOk && passwordOk && confirmOk) {
        window.location.href = 'index.html';
      }
    });
  }

  // ==========================================
  // SHARED HELPERS
  // setError — shows error border and message
  // setSuccess — shows success border and message
  // clearState — removes both states
  // ==========================================

  function setError(input, errorId, successId) {
    input.classList.add('error');
    input.classList.remove('success');
    const error = document.getElementById(errorId);
    const success = document.getElementById(successId);
    if (error) error.classList.add('visible');
    if (success) success.classList.remove('visible');
  }

  function setSuccess(input, errorId, successId) {
    input.classList.remove('error');
    input.classList.add('success');
    const error = document.getElementById(errorId);
    const success = document.getElementById(successId);
    if (error) error.classList.remove('visible');
    if (success) success.classList.add('visible');
  }

  function clearState(input, errorId, successId) {
    input.classList.remove('error', 'success');
    const error = document.getElementById(errorId);
    const success = document.getElementById(successId);
    if (error) error.classList.remove('visible');
    if (success) success.classList.remove('visible');
  }

  // ==========================================
  // 9. LISTINGS SKELETON → REAL CARDS
  // ==========================================

  const skeletonGrid = document.getElementById('skeleton-grid');
  const realGrid = document.getElementById('real-grid');

  if (skeletonGrid && realGrid) {
    setTimeout(() => {
      skeletonGrid.style.display = 'none';
      realGrid.style.display = 'grid';
      realGrid.classList.add('fade-in');

      const urlParams = new URLSearchParams(window.location.search);
      const urlQuery = urlParams.get('search');
      if (urlQuery) {
        filterListings(urlQuery);
        if (searchInput) searchInput.value = urlQuery;
      }
    }, 1000);
  }

  function filterListings(query) {
    const cards = document.querySelectorAll('.card[data-name]');
    if (cards.length === 0) return;
    const q = query.toLowerCase().trim();
    cards.forEach(card => {
      const name = card.getAttribute('data-name').toLowerCase();
      card.style.display = (q === '' || name.includes(q))
        ? 'block' : 'none';
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      filterListings(searchInput.value);
    });
  }

});

function handleSuggestion(term) {
  window.location.href =
    `listings.html?search=${encodeURIComponent(term)}`;
}