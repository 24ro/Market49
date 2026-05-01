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
  // aria-expanded tracks open/closed state
  // for screen readers
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
      // Tell screen readers the menu is now open
      hamburger.setAttribute('aria-expanded', 'true');
    });
  }

  if (closeMenu) closeMenu.addEventListener('click', closeNav);
  if (menuOverlay) menuOverlay.addEventListener('click', closeNav);

  if (mobileMenu) {
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeNav);
    });
  }

  function closeNav() {
    if (mobileMenu) mobileMenu.classList.remove('open');
    if (menuOverlay) menuOverlay.classList.remove('visible');
    document.body.style.overflow = '';
    // Tell screen readers the menu is now closed
    if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
  }

  // ==========================================
  // 2. DARK MODE TOGGLE
  // aria-checked tracks on/off state for
  // screen readers since toggle uses role=switch
  // ==========================================

  const toggle = document.getElementById('dark-toggle');
  const savedMode = localStorage.getItem('darkMode');

  if (savedMode === 'true') {
    document.body.classList.add('dark');
    if (toggle) {
      toggle.classList.add('active');
      // Reflect saved state in aria-checked on load
      toggle.setAttribute('aria-checked', 'true');
    }
  } else {
    if (toggle) toggle.setAttribute('aria-checked', 'false');
  }

  if (toggle) {
    toggle.addEventListener('click', () => {
      document.body.classList.toggle('dark');
      const isDark = document.body.classList.contains('dark');
      toggle.classList.toggle('active', isDark);
      // Keep aria-checked in sync with actual state
      toggle.setAttribute('aria-checked', isDark.toString());
      localStorage.setItem('darkMode', isDark);
    });

    // Allow keyboard activation of toggle with Enter/Space
    // since it uses role=switch instead of a button
    toggle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle.click();
      }
    });
  }

  // ==========================================
  // 3. SEARCH — real-time filtering
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

    const searchBtn = document.getElementById('search-btn');
    if (searchBtn) {
      searchBtn.addEventListener('click', () => {
        const val = searchInput.value.trim();
        if (val !== '') {
          window.location.href =
            `listings.html?search=${encodeURIComponent(val)}`;
        }
      });
    }

    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const val = searchInput.value.trim();
        if (val !== '') {
          window.location.href =
            `listings.html?search=${encodeURIComponent(val)}`;
        }
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
  // ==========================================

  const postForm = document.getElementById('post-listing-form');

  if (postForm) {

    const titleInput = document.getElementById('title');
    if (titleInput) {
      titleInput.addEventListener('blur', () => {
        titleInput.dataset.touched = 'true';
        validateTitle();
      });
      titleInput.addEventListener('input', () => {
        if (titleInput.dataset.touched) validateTitle();
      });
    }

    function validateTitle() {
      const input = document.getElementById('title');
      if (!input) return true;
      const val = input.value.trim();
      if (val === '') {
        setError(input, 'title-error', 'title-success',
          'Title is required');
        return false;
      }
      if (val.length < 3) {
        setError(input, 'title-error', 'title-success',
          `Title must be at least 3 characters — you have ${val.length}`);
        return false;
      }
      setSuccess(input, 'title-error', 'title-success');
      return true;
    }

    const priceInput = document.getElementById('price');
    if (priceInput) {
      priceInput.addEventListener('blur', () => {
        priceInput.dataset.touched = 'true';
        validatePrice();
      });
      priceInput.addEventListener('input', () => {
        if (priceInput.dataset.touched) validatePrice();
      });
    }

    function validatePrice() {
      const input = document.getElementById('price');
      if (!input) return true;
      const val = input.value.trim();
      if (val === '') {
        setError(input, 'price-error', 'price-success',
          'Price is required');
        return false;
      }
      if (isNaN(parseFloat(val))) {
        setError(input, 'price-error', 'price-success',
          'Please enter a valid number — example: 25.00');
        return false;
      }
      if (parseFloat(val) <= 0) {
        setError(input, 'price-error', 'price-success',
          'Price must be greater than $0');
        return false;
      }
      setSuccess(input, 'price-error', 'price-success');
      return true;
    }

    const descInput = document.getElementById('description');
    const descCounter = document.getElementById('desc-counter');
    if (descInput) {
      descInput.addEventListener('blur', () => {
        descInput.dataset.touched = 'true';
        validateDescription();
      });
      descInput.addEventListener('input', () => {
        const len = descInput.value.trim().length;
        if (descCounter) {
          descCounter.textContent = `${len} / 20 minimum`;
          descCounter.style.color = len >= 20
            ? 'var(--success)' : 'var(--text-secondary)';
        }
        if (descInput.dataset.touched) validateDescription();
      });
    }

    function validateDescription() {
      const input = document.getElementById('description');
      if (!input) return true;
      const val = input.value.trim();
      if (val === '') {
        setError(input, 'desc-error', 'desc-success',
          'Description is required — minimum 20 characters');
        return false;
      }
      if (val.length < 20) {
        setError(input, 'desc-error', 'desc-success',
          `Description must be at least 20 characters — you have ${val.length}`);
        return false;
      }
      setSuccess(input, 'desc-error', 'desc-success');
      return true;
    }

    postForm.addEventListener('submit', (e) => {
      e.preventDefault();

      ['title', 'price', 'description'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.dataset.touched = 'true';
      });

      const titleOk = validateTitle();
      const priceOk = validatePrice();
      const descOk = validateDescription();

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
        const toast = document.getElementById('post-toast');
        const submitBtn = postForm.querySelector('[type="submit"]');

        if (overlay) overlay.classList.add('visible');
        if (submitBtn) submitBtn.classList.add('btn-loading');

        setTimeout(() => {
          if (overlay) overlay.classList.remove('visible');
          if (toast) toast.classList.add('visible');
          setTimeout(() => {
            window.location.href = 'manage-listings.html';
          }, 1200);
        }, 1500);
      }
    });
  }

  // ==========================================
  // 7. CHECKOUT FORM — real-time validation
  // ==========================================

  const checkoutForm = document.getElementById('checkout-form');

  if (checkoutForm) {

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

    function validateName() {
      const input = document.getElementById('full-name');
      if (!input) return true;
      const val = input.value.trim();
      if (val === '') {
        setError(input, 'name-error', 'name-success',
          'Full name is required');
        return false;
      }
      if (!/^[a-zA-Z\s\'-]+$/.test(val)) {
        setError(input, 'name-error', 'name-success',
          'Name can only contain letters — no numbers or symbols');
        return false;
      }
      const words = val.split(/\s+/).filter(w => w.length >= 2);
      if (words.length < 2) {
        setError(input, 'name-error', 'name-success',
          'Enter your first and last name — at least 2 characters each');
        return false;
      }
      setSuccess(input, 'name-error', 'name-success');
      return true;
    }
    attachListeners('full-name', validateName);

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
          'Enter a valid email like you@example.com or a 10-digit phone number');
        return false;
      }
      setSuccess(input, 'contact-error', 'contact-success');
      return true;
    }
    attachListeners('contact', validateContact);

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
          `Address must be at least 5 characters — you have ${val.length}`);
        return false;
      }
      setSuccess(input, 'address-error', 'address-success');
      return true;
    }
    attachListeners('address', validateAddress);

    function validateCity() {
      const input = document.getElementById('city');
      if (!input) return true;
      const val = input.value.trim();
      if (val === '') {
        setError(input, 'city-error', 'city-success',
          'City is required');
        return false;
      }
      if (!/^[a-zA-Z\s\'-]+$/.test(val) || val.length < 2) {
        setError(input, 'city-error', 'city-success',
          'Enter a valid city name — letters only, at least 2 characters');
        return false;
      }
      setSuccess(input, 'city-error', 'city-success');
      return true;
    }
    attachListeners('city', validateCity);

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
          'Enter a valid state — letters only, at least 2 characters');
        return false;
      }
      setSuccess(input, 'state-error', 'state-success');
      return true;
    }
    attachListeners('state', validateState);

    const zipInput = document.getElementById('zip');
    if (zipInput) {
      zipInput.addEventListener('input', () => {
        zipInput.value = zipInput.value.replace(/\D/g, '').slice(0, 5);
        if (zipInput.dataset.touched) validateZip();
      });
      zipInput.addEventListener('blur', () => {
        zipInput.dataset.touched = 'true';
        validateZip();
      });
    }

    function validateZip() {
      const input = document.getElementById('zip');
      if (!input) return true;
      const val = input.value.trim();
      if (val === '') {
        setError(input, 'zip-error', 'zip-success',
          'ZIP code is required');
        return false;
      }
      if (!/^\d{5}$/.test(val)) {
        setError(input, 'zip-error', 'zip-success',
          `ZIP code must be exactly 5 digits — you have ${val.length}`);
        return false;
      }
      setSuccess(input, 'zip-error', 'zip-success');
      return true;
    }

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
          'Month must be between 01 and 12 — example: 08/27');
        return false;
      }
      const now = new Date();
      if (year < now.getFullYear() ||
         (year === now.getFullYear() &&
          month < now.getMonth() + 1)) {
        setError(input, 'expiry-error', 'expiry-success',
          'This card has expired — check the date on your card');
        return false;
      }
      setSuccess(input, 'expiry-error', 'expiry-success');
      return true;
    }

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
          'CVC is required — 3-digit code on the back of your card');
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

    function validateCardName() {
      const input = document.getElementById('card-name');
      if (!input) return true;
      const val = input.value.trim();
      if (val === '') {
        setError(input, 'card-name-error', 'card-name-success',
          'Name on card is required');
        return false;
      }
      if (!/^[a-zA-Z\s\'-]+$/.test(val) || val.length < 2) {
        setError(input, 'card-name-error', 'card-name-success',
          'Enter the name as it appears on your card — letters only');
        return false;
      }
      setSuccess(input, 'card-name-error', 'card-name-success');
      return true;
    }
    attachListeners('card-name', validateCardName);

    checkoutForm.addEventListener('submit', (e) => {
      e.preventDefault();

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
  // ==========================================

  const signinForm = document.getElementById('signin-form');

  if (signinForm) {

    const emailInput     = document.getElementById('email');
    const studentIdInput = document.getElementById('student-id');
    const passwordInput  = document.getElementById('password');

    const emailPattern     = /^[^\s@]+@charlotte\.edu$/i;
    const studentIdPattern = /^800\d{6}$/;

    if (emailInput) {
      emailInput.addEventListener('blur', () => {
        emailInput.dataset.touched = 'true';
        validateEmail();
      });
      emailInput.addEventListener('input', () => {
        if (emailInput.dataset.touched) validateEmail();
      });
    }

    if (studentIdInput) {
      studentIdInput.addEventListener('input', () => {
        studentIdInput.value =
          studentIdInput.value.replace(/\D/g, '').slice(0, 9);
        if (studentIdInput.dataset.touched) validateStudentId();
      });
      studentIdInput.addEventListener('blur', () => {
        studentIdInput.dataset.touched = 'true';
        validateStudentId();
      });
    }

    if (passwordInput) {
      passwordInput.addEventListener('blur', () => {
        passwordInput.dataset.touched = 'true';
        validatePassword();
      });
      passwordInput.addEventListener('input', () => {
        if (passwordInput.dataset.touched) validatePassword();
      });
    }

    function validateEmail() {
      const val = emailInput.value.trim();
      if (val === '') {
        setError(emailInput, 'email-error', 'email-success',
          'Please enter your Charlotte email address');
        return false;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
        setError(emailInput, 'email-error', 'email-success',
          'Enter a valid email address like name@charlotte.edu');
        return false;
      }
      if (!emailPattern.test(val)) {
        setError(emailInput, 'email-error', 'email-success',
          'Use your @charlotte.edu email to verify your campus account');
        return false;
      }
      setSuccess(emailInput, 'email-error', 'email-success');
      return true;
    }

    function validateStudentId() {
      const val = studentIdInput.value.trim();
      if (val === '') {
        setError(studentIdInput, 'student-id-error',
          'student-id-success',
          'Enter your 49er ID to sign in');
        return false;
      }
      if (!studentIdPattern.test(val)) {
        setError(studentIdInput, 'student-id-error',
          'student-id-success',
          '49er ID must be 9 digits and start with 800 — example: 800123456');
        return false;
      }
      setSuccess(studentIdInput, 'student-id-error',
        'student-id-success');
      return true;
    }

    function validatePassword() {
      const val = passwordInput.value;
      if (val === '') {
        setError(passwordInput, 'password-error', 'password-success',
          'Enter your password to continue');
        return false;
      }
      if (val.length < 8) {
        setError(passwordInput, 'password-error', 'password-success',
          `Password must be at least 8 characters — you have ${val.length}`);
        return false;
      }
      if (!/[A-Z]/.test(val)) {
        setError(passwordInput, 'password-error', 'password-success',
          'Add at least 1 uppercase letter');
        return false;
      }
      if (!/\d/.test(val)) {
        setError(passwordInput, 'password-error', 'password-success',
          'Add at least 1 number');
        return false;
      }
      setSuccess(passwordInput, 'password-error', 'password-success');
      return true;
    }

    signinForm.addEventListener('submit', (e) => {
      e.preventDefault();

      ['email', 'student-id', 'password'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.dataset.touched = 'true';
      });

      const emailOk     = validateEmail();
      const studentIdOk = validateStudentId();
      const passwordOk  = validatePassword();

      if (emailOk && studentIdOk && passwordOk) {
        window.location.href = 'index.html';
      }
    });
  }

  // ==========================================
  // SHARED HELPERS
  // setError(input, errorId, successId, message)
  // setSuccess(input, errorId, successId)
  // clearState(input, errorId, successId)
  // ==========================================

  function setError(input, errorId, successId, message) {
    input.classList.remove('success');
    input.classList.add('error');
    input.setAttribute('aria-invalid', 'true');
    const error = document.getElementById(errorId);
    const success = document.getElementById(successId);
    if (error) {
      if (message) error.textContent = message;
      error.classList.add('visible');
      error.style.display = 'block';
    }
    if (success) {
      success.classList.remove('visible');
      success.style.display = 'none';
    }
  }

  function setSuccess(input, errorId, successId) {
    input.classList.remove('error');
    input.classList.add('success');
    input.setAttribute('aria-invalid', 'false');
    const error = document.getElementById(errorId);
    const success = document.getElementById(successId);
    if (error) {
      error.classList.remove('visible');
      error.style.display = 'none';
    }
    if (success) {
      success.classList.add('visible');
      success.style.display = 'block';
    }
  }

  function clearState(input, errorId, successId) {
    input.classList.remove('error', 'success');
    input.removeAttribute('aria-invalid');
    const error = document.getElementById(errorId);
    const success = document.getElementById(successId);
    if (error) {
      error.classList.remove('visible');
      error.style.display = 'none';
    }
    if (success) {
      success.classList.remove('visible');
      success.style.display = 'none';
    }
  }

  function markTouched(id) {
    const el = document.getElementById(id);
    if (el) el.dataset.touched = 'true';
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