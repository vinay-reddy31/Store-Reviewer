// Client-side validation mirroring the backend rules.

export function validateName(name) {
  if (!name || name.trim().length < 20 || name.trim().length > 60) {
    return 'Name must be between 20 and 60 characters.';
  }
  return '';
}

export function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !re.test(email)) {
    return 'Enter a valid email address.';
  }
  return '';
}

export function validateAddress(address) {
  if (address && address.length > 400) {
    return 'Address must be at most 400 characters.';
  }
  return '';
}

export function validatePassword(password) {
  if (!password || password.length < 8 || password.length > 16) {
    return 'Password must be 8-16 characters.';
  }
  if (!/[A-Z]/.test(password)) {
    return 'Password must include at least one uppercase letter.';
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    return 'Password must include at least one special character.';
  }
  return '';
}
