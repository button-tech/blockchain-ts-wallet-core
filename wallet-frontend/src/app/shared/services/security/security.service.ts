import { AES as aes, PBKDF2, lib, mode, pad, enc, WordArray } from 'crypto-js';

export interface Cipher {
  text: string;
  salt: string;
  iv;
}

export class Security {
  static encryptSecret(secret: string, password: string): Cipher {
    const salt = lib.WordArray.random(256 / 8);
    const iv = lib.WordArray.random(128 / 8);

    const opt = {
      iv,
      mode: mode.CBC,
      padding: pad.Pkcs7
    };
    const key = this.generateKey(password, salt);
    const cipherText = aes.encrypt(secret, key, opt);
    return {
      text: cipherText.toString(),
      salt: salt.toString(),
      iv: iv.toString()
    };
  }

  static decryptSecret(cipher: string, password: string, salt?: string, iv?: string): string {
    const key = this.generateKey(password, salt);

    const opt = iv
      ? { iv: enc.Hex.parse(iv), mode: mode.CBC, padding: pad.Pkcs7 }
      : { mode: mode.CBC, padding: pad.Pkcs7 };
    const secret = aes.decrypt(cipher, key, opt);
    // todo: handle error: in case of empty string or error - throw error(bad password)
    return secret.toString(enc.Utf8);
  }

  private static generateKey(password: string, salt?: string | WordArray): string | WordArray {
    if (salt) {
      if (typeof salt === 'string') {
        salt = enc.Hex.parse(salt);
      }
      return PBKDF2(password, salt, { keySize: 128 / 32, iterations: 1000 });
    }
    return password;
  }
}
