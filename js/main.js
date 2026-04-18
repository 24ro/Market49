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
  // ==========================================

  const checkoutForm = document.getElementById('checkout-form');

  if (checkoutForm) {

    // Helper to attach blur + input listeners to a field
    function attachListeners(inputId, validateFn) {
      const input = document.getElementById(inputId);
      if (!input) return;
      input.addEventListener('blur', () => {
        input.dataset.touched = 'true';
        validateFn();
      });
      input.addEventListener('input', () => {
        if (input.dataset.touched) validateFn();
      });
    }

    // Full name — must contain only letters and spaces,
    // at least two words, each word min 2 characters
    function validateName() {
      const input = document.getElementById('full-name');
      if (!input) return true;
      const val = input.value.trim();
      if (val === '') {
        setError(input, 'name-error', 'name-success',
          'Full name is required');
        return false;
      }
      if (!/^[a-zA-Z\s'-]+$/.test(val)) {
        setError(input, 'name-error', 'name-success',
          'Name can only contain letters');
        return false;
      }
      const words = val.split(/\s+/).filter(w => w.length >= 2);
      if (words.length < 2) {
        setError(input, 'name-error', 'name-success',
          'Please enter your first and last name');
        return false;
      }
      setSuccess(input, 'name-error', 'name-success');
      return true;
    }
    attachListeners('full-name', validateName);

    // Contact — must be valid email format OR exactly
    // 10 digits (ignoring spaces, dashes, parentheses)
    function validateContact() {
      const input = document.getElementById('contact');
      if (!input) return true;
      const val = input.value.trim();
      if (val === '') {
        setError(input, 'contact-error', 'contact-success',
          'Phone or email is required');
        return false;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
      const digits = val.replace(/[\s\-\(\)\+]/g, '');
      const phoneValid = /^\d{10}$/.test(digits);
      if (!emailRegex.test(val) && !phoneValid) {
        setError(input, 'contact-error', 'contact-success',
          'Enter a valid email (you@example.com) or 10-digit phone');
        return false;
      }
      setSuccess(input, 'contact-error', 'contact-success');
      return true;
    }
    attachListeners('contact', validateContact);

    // Street address — required, min 5 characters
    function validateAddress() {
      const input = document.getElementById('address');
      if (!input) return true;
      const val = input.value.trim();
      if (val === '') {
        setError(input, 'address-error', 'address-success',
          'Street address is required');
        return false;
      }
      if (val.length < 5) {
        setError(input, 'address-error', 'address-success',
          'Please enter a complete street address');
        return false;
      }
      setSuccess(input, 'address-error', 'address-success');
      return true;
    }
    attachListeners('address', validateAddress);

    // City — required, letters only, min 2 characters
    function validateCity() {
      const input = document.getElementById('city');
      if (!input) return true;
      const val = input.value.trim();
      if (val === '') {
        setError(input, 'city-error', 'city-success',
          'City is required');
        return false;
      }
      if (!/^[a-zA-Z\s'-]+$/.test(val) || val.length < 2) {
        setError(input, 'city-error', 'city-success',
          'Please enter a valid city name');
        return false;
      }
      setSuccess(input, 'city-error', 'city-success');
      return true;
    }
    attachListeners('city', validateCity);

    // State — required, letters only, min 2 characters
    function validateState() {
      const input = document.getElementById('state');
      if (!input) return true;
      const val = input.value.trim();
      if (val === '') {
        setError(input, 'state-error', 'state-success',
          'State is required');
        return false;
      }
      if (!/^[a-zA-Z\s]+$/.test(val) || val.length < 2) {
        setError(input, 'state-error', 'state-success',
          'Please enter a valid state');
        return false;
      }
      setSuccess(input, 'state-error', 'state-success');
      return true;
    }
    attachListeners('state', validateState);

    // ZIP — required, exactly 5 digits, no letters
    function validateZip() {
      const input = document.getElementById('zip');
      if (!input) return true;
      // Strip non-digits on input
      input.addEventListener('input', () => {
        input.value = input.value.replace(/\D/g, '').slice(0, 5);
      });
      const val = input.value.trim();
      if (val === '') {
        setError(input, 'zip-error', 'zip-success',
          'ZIP code is required');
        return false;
      }
      if (!/^\d{5}$/.test(val)) {
        setError(input, 'zip-error', 'zip-success',
          `ZIP must be 5 digits — you have ${val.length}`);
        return false;
      }
      setSuccess(input, 'zip-error', 'zip-success');
      return true;
    }
    attachListeners('zip', validateZip);

    // Card number — exactly 16 digits
    // Auto formats as 1234 5678 9012 3456
    // No success until all 16 digits present
    const cardInput = document.getElementById('card-number');
    if (cardInput) {
      cardInput.addEventListener('input', () => {
        let digits = cardInput.value.replace(/\D/g, '').slice(0, 16);
        cardInput.value = digits.replace(/(.{4})/g, '$1 ').trim();
        if (cardInput.dataset.touched) validateCard();
      });
      cardInput.addEventListener('blur', () => {
        cardInput.dataset.touched = 'true';
        validateCard();
      });
    }

    function validateCard() {
      const input = document.getElementById('card-number');
      if (!input) return true;
      const digits = input.value.replace(/\D/g, '');
      if (digits === '') {
        setError(input, 'card-error', 'card-success',
          'Card number is required');
        return false;
      }
      if (digits.length < 16) {
        setError(input, 'card-error', 'card-success',
          `Card number must be 16 digits — you have ${digits.length}`);
        return false;
      }
      setSuccess(input, 'card-error', 'card-success');
      return true;
    }

    // Expiry — MM must be 01-12, year must not be expired
    // Auto inserts / after 2 digits
    const expiryInput = document.getElementById('expiry');
    if (expiryInput) {
      expiryInput.addEventListener('input', () => {
        let digits = expiryInput.value.replace(/\D/g, '').slice(0, 4);
        if (digits.length >= 3) {
          digits = digits.slice(0, 2) + '/' + digits.slice(2);
        }
        expiryInput.value = digits;
        if (expiryInput.dataset.touched) validateExpiry();
      });
      expiryInput.addEventListener('blur', () => {
        expiryInput.dataset.touched = 'true';
        validateExpiry();
      });
    }

    function validateExpiry() {
      const input = document.getElementById('expiry');
      if (!input) return true;
      const val = input.value.trim();
      if (val === '') {
        setError(input, 'expiry-error', 'expiry-success',
          'Expiration date is required');
        return false;
      }
      if (!/^\d{2}\/\d{2}$/.test(val)) {
        setError(input, 'expiry-error', 'expiry-success',
          'Use MM/YY format — example: 08/27');
        return false;
      }
      const month = parseInt(val.slice(0, 2));
      const year  = parseInt('20' + val.slice(3));
      if (month < 1 || month > 12) {
        setError(input, 'expiry-error', 'expiry-success',
          'Month must be between 01 and 12');
        return false;
      }
      const now = new Date();
      const currentYear  = now.getFullYear();
      const currentMonth = now.getMonth() + 1;
      if (year < currentYear ||
         (year === currentYear && month < currentMonth)) {
        setError(input, 'expiry-error', 'expiry-success',
          'This card has expired');
        return false;
      }
      setSuccess(input, 'expiry-error', 'expiry-success');
      return true;
    }

    // CVC — exactly 3 digits, no letters
    // No success until all 3 digits present
    const cvcInput = document.getElementById('cvc');
    if (cvcInput) {
      cvcInput.addEventListener('input', () => {
        cvcInput.value = cvcInput.value.replace(/\D/g, '').slice(0, 3);
        if (cvcInput.dataset.touched) validateCVC();
      });
      cvcInput.addEventListener('blur', () => {
        cvcInput.dataset.touched = 'true';
        validateCVC();
      });
    }

    function validateCVC() {
      const input = document.getElementById('cvc');
      if (!input) return true;
      const val = input.value.trim();
      if (val === '') {
        setError(input, 'cvc-error', 'cvc-success',
          'CVC is required');
        return false;
      }
      if (val.length < 3) {
        setError(input, 'cvc-error', 'cvc-success',
          `CVC must be 3 digits — you have ${val.length}`);
        return false;
      }
      setSuccess(input, 'cvc-error', 'cvc-success');
      return true;
    }

    // Name on card — letters only, min 2 characters
    function validateCardName() {
      const input = document.getElementById('card-name');
      if (!input) return true;
      const val = input.value.trim();
      if (val === '') {
        setError(input, 'card-name-error', 'card-name-success',
          'Name on card is required');
        return false;
      }
      if (!/^[a-zA-Z\s'-]+$/.test(val) || val.length < 2) {
        setError(input, 'card-name-error', 'card-name-success',
          'Please enter the name as it appears on your card');
        return false;
      }
      setSuccess(input, 'card-name-error', 'card-name-success');
      return true;
    }
    attachListeners('card-name', validateCardName);

    // Submit — marks all fields touched then runs all validators
    checkoutForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Force all fields to touched so errors show
      ['full-name', 'contact', 'address', 'city', 'state',
       'zip', 'card-number', 'expiry', 'cvc', 'card-name']
        .forEach(id => {
          const el = document.getElementById(id);
          if (el) el.dataset.touched = 'true';
        });

      const nameOk     = validateName();
      const contactOk  = validateContact();
      const addressOk  = validateAddress();
      const cityOk     = validateCity();
      const stateOk    = validateState();
      const zipOk      = validateZip();
      const cardOk     = validateCard();
      const expiryOk   = validateExpiry();
      const cvcOk      = validateCVC();
      const cardNameOk = validateCardName();

      if (nameOk && contactOk && addressOk && cityOk &&
          stateOk && zipOk && cardOk && expiryOk &&
          cvcOk && cardNameOk) {
        const overlay = document.getElementById('loading-overlay');
        const submitBtn =
          checkoutForm.querySelector('[type="submit"]');
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
  // Requires 3 meaningful fields: email, 49er ID,
  // and password. Errors appear inline beside
  // each field while the user is typing.
  // ==========================================

  const signinForm = document.getElementById('signin-form');

  if (signinForm) {
    const emailInput = document.getElementById('email');
    const studentIdInput = document.getElementById('student-id');
    const passwordInput = document.getElementById('password');

    const emailPattern = /^[^\s@]+@charlotte\.edu$/i;
    const studentIdPattern = /^800\d{6}$/;
    const passwordPattern = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (emailInput) {
      emailInput.addEventListener('input', validateEmail);
      emailInput.addEventListener('blur', validateEmail);
    }

    if (studentIdInput) {
      studentIdInput.addEventListener('input', () => {
        studentIdInput.value = studentIdInput.value.replace(/\D/g, '').slice(0, 9);
        validateStudentId();
      });
      studentIdInput.addEventListener('blur', validateStudentId);
    }

    if (passwordInput) {
      passwordInput.addEventListener('input', validatePassword);
      passwordInput.addEventListener('blur', validatePassword);
    }

    function validateEmail() {
      const val = emailInput.value.trim();

      if (val === '') {
        setError(emailInput, 'email-error', 'Please enter your Charlotte email address.', 'email-success');
        return false;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
        setError(emailInput, 'email-error', 'Enter a valid email address, like name@charlotte.edu.', 'email-success');
        return false;
      }

      if (!emailPattern.test(val)) {
        setError(emailInput, 'email-error', 'Use your @charlotte.edu email so we can verify your campus account.', 'email-success');
        return false;
      }

      setSuccess(emailInput, 'email-error', 'email-success');
      return true;
    }

    function validateStudentId() {
      const val = studentIdInput.value.trim();

      if (val === '') {
        setError(studentIdInput, 'student-id-error', 'Enter your 49er ID to sign in to the campus marketplace.', 'student-id-success');
        return false;
      }

      if (!/^\d+$/.test(val)) {
        setError(studentIdInput, 'student-id-error', '49er ID should contain numbers only.', 'student-id-success');
        return false;
      }

      if (!studentIdPattern.test(val)) {
        setError(studentIdInput, 'student-id-error', '49er ID must be 9 digits and start with 800.', 'student-id-success');
        return false;
      }

      setSuccess(studentIdInput, 'student-id-error', 'student-id-success');
      return true;
    }

    function validatePassword() {
      const val = passwordInput.value;

      if (val === '') {
        setError(passwordInput, 'password-error', 'Enter your password to continue.', 'password-success');
        return false;
      }

      if (val.length < 8) {
        setError(passwordInput, 'password-error', 'Password must be at least 8 characters long.', 'password-success');
        return false;
      }

      if (!/[A-Z]/.test(val)) {
        setError(passwordInput, 'password-error', 'Add at least 1 uppercase letter so your password is stronger.', 'password-success');
        return false;
      }

      if (!/\d/.test(val)) {
        setError(passwordInput, 'password-error', 'Add at least 1 number to finish meeting the password rules.', 'password-success');
        return false;
      }

      if (!passwordPattern.test(val)) {
        setError(passwordInput, 'password-error', 'Password does not meet the sign-in requirements yet.', 'password-success');
        return false;
      }

      setSuccess(passwordInput, 'password-error', 'password-success');
      return true;
    }

    signinForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const emailOk = validateEmail();
      const studentIdOk = validateStudentId();
      const passwordOk = validatePassword();

      if (emailOk && studentIdOk && passwordOk) {
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

  function setError(input, errorId, message, successId) {
    input.classList.add('error');
    input.classList.remove('success');
    input.setAttribute('aria-invalid', 'true');
    const error = document.getElementById(errorId);
    const success = document.getElementById(successId);
    if (error) {
      error.textContent = message;
      error.classList.add('visible');
    }
    if (success) success.classList.remove('visible');
  }

  function setSuccess(input, errorId, successId) {
    input.classList.remove('error');
    input.classList.add('success');
    input.setAttribute('aria-invalid', 'false');
    const error = document.getElementById(errorId);
    const success = document.getElementById(successId);
    if (error) error.classList.remove('visible');
    if (success) success.classList.add('visible');
  }

  function clearState(input, errorId, successId) {
    input.classList.remove('error', 'success');
    input.removeAttribute('aria-invalid');
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
