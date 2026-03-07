/**
 * Custom validation with better error messages
 */
export const validateEmail = (email: string): string | null => {
  if (!email?.trim()) return 'Email is required';
  // Standard email regex with better pattern
  const emailRegex = /^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) return 'Please enter a valid email (e.g., user@example.com)';
  if (!checkEmailAvailability(email)) return 'This email is already registered';
  return null;
};

/**
 * India-specific phone validation
 */
export const validateIndianPhone = (phone: string): string | null => {
  if (!phone?.trim()) return 'Phone number is required';
  const cleaned = phone.replace(/\D/g, '');
  // Must be 10 digits AND start with 6-9 (valid Indian mobile)
  const isValid = cleaned.length === 10 && /^[6-9]/.test(cleaned);
  if (!isValid) return 'Enter a valid 10-digit Indian mobile number';
  return null;
};

/**
 * Custom PIN code validation with city mapping
 */
export const validateIndianPinCode = (pinCode: string): string | null => {
  if (!pinCode?.trim()) return 'PIN code is required';
  const cleaned = pinCode.replace(/\D/g, '');
  // Must be exactly 6 digits
  const isValid = cleaned.length === 6 && /^\d{6}$/.test(cleaned);
  if (!isValid) return 'PIN code must be 6 digits';
  return null;
};

/**
 * Custom: Check if email is already used (mock check)
 */
export const checkEmailAvailability = (email: string): boolean => {
  const blockedEmails = ['test@test.com', 'admin@admin.com'];
  return !blockedEmails.includes(email.toLowerCase());
};

/**
 * Comprehensive validation function with detailed errors
 */
export const validateAddressForm = (address: any) => {
  const errors: Record<string, string> = {};
  
  // Full Name: Min 3 chars, no numbers
  if (!address.fullName?.trim()) {
    errors.fullName = 'Full name is required';
  } else if (address.fullName.length < 3) {
    errors.fullName = 'Name must be at least 3 characters';
  } else if (/\d/.test(address.fullName)) {
    errors.fullName = 'Name should not contain numbers';
  }
  
  // Email: Standard validation
  const emailError = validateEmail(address.email);
  if (emailError) errors.email = emailError;
  
  // Phone: India-specific
  const phoneError = validateIndianPhone(address.phone);
  if (phoneError) errors.phone = phoneError;
  
  // PIN Code: 6 digits
  const pinError = validateIndianPinCode(address.pinCode);
  if (pinError) errors.pinCode = pinError;
  
  // City: Required, no numbers
  if (!address.city?.trim()) {
    errors.city = 'City is required';
  } else if (address.city.length < 2) {
    errors.city = 'City name is too short';
  }
  
  // State: Required
  if (!address.state?.trim()) {
    errors.state = 'State is required';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
