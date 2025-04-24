import CryptoJS from 'crypto-js';

export const generateHmac = (value, secret) => CryptoJS.HmacSHA256(value, secret).toString();