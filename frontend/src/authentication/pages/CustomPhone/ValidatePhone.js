import { isValidPhoneNumber } from 'libphonenumber-js';

const validatePhoneNumber = (phoneNumber, countryCode) => {
  try {
    const parsedPhoneNumber = isValidPhoneNumber(`+${phoneNumber}`, countryCode);
    return parsedPhoneNumber ? null : 'Invalid phone number';
  } catch (error) {
    return 'Invalid phone number';
  }
};

export default validatePhoneNumber;
