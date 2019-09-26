import { random } from 'pokemon';
import randomString from 'random-string';

/**
 * Get pokemon random name
 */
export function GetRandomName() {
  return random('en');
}

/**
 * Get client id random string
 * @param length
 */
export function GetRandomString(length: number = 8) {
  return randomString({ length });
}
