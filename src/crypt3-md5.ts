import * as CryptoJS from 'crypto-js';

const SALT_MAXLEN = 8;
const MD5_MAGIC_STRING = '$1$';

export const crypt = (password: string, salt: string = ''): string => {
  const parsedPassword = CryptoJS.enc.Utf8.parse(password);
  const parsedSalt = parseSalt(salt);

  const ctx = CryptoJS.algo.MD5.create();

  ctx.update(parsedPassword);
  ctx.update(parsedSalt);
  ctx.update(parsedPassword);

  let fin = ctx.finalize();

  ctx.reset();

  ctx.update(parsedPassword);
  ctx.update(MD5_MAGIC_STRING);
  ctx.update(parsedSalt);

  for (let pl = parsedPassword.sigBytes; pl > 0; pl -= 16) {
    ctx.update(CryptoJS.lib.WordArray.create(fin.words, Math.min(pl, 16)));
  }

  const empty = CryptoJS.lib.WordArray.create([0], 1);
  const pwc1 = CryptoJS.lib.WordArray.create(parsedPassword.words, 1);
  for (let i = parsedPassword.sigBytes; i !== 0; i >>>= 1) {
    if ((i & 1) !== 0) {
      ctx.update(empty);
    } else {
      ctx.update(pwc1);
    }
  }

  fin = ctx.finalize();

  for (let i = 0; i < 1000; ++i) {
    ctx.reset();

    if ((i & 1) !== 0) {
      ctx.update(password);
    } else {
      ctx.update(fin);
    }

    if (i % 3 !== 0) {
      ctx.update(parsedSalt);
    }

    if (i % 7 !== 0) {
      ctx.update(password);
    }

    if ((i & 1) !== 0) {
      ctx.update(fin);
    } else {
      ctx.update(password);
    }

    fin = ctx.finalize();
  }

  const finb = wordArrayToByteArray(fin);
  return (
    MD5_MAGIC_STRING +
    parsedSalt +
    '$' +
    to64((finb[0] << 16) | (finb[6] << 8) | finb[12], 4) +
    to64((finb[1] << 16) | (finb[7] << 8) | finb[13], 4) +
    to64((finb[2] << 16) | (finb[8] << 8) | finb[14], 4) +
    to64((finb[3] << 16) | (finb[9] << 8) | finb[15], 4) +
    to64((finb[4] << 16) | (finb[10] << 8) | finb[5], 4) +
    to64(finb[11], 2)
  );
};

const parseSalt = (salt: string) => {
  let saltStart = 0;
  if (salt.indexOf(MD5_MAGIC_STRING) === 0) {
    saltStart += MD5_MAGIC_STRING.length;
  }

  let saltEnd = Math.min(
    SALT_MAXLEN + MD5_MAGIC_STRING.length,
    salt.indexOf('$', saltStart),
  );

  if (saltEnd < 0) {
    saltEnd = SALT_MAXLEN + MD5_MAGIC_STRING.length;
  }
  return salt.substring(saltStart, saltEnd);
};

const wordArrayToByteArray = (wa: CryptoJS.lib.WordArray) => {
  const bytes: Array<number> = [];
  for (let i = 0; i < wa.sigBytes; ++i) {
    bytes.push((wa.words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff);
  }

  return bytes;
};

const to64 = (value: number, digits: number) => {
  const itoa64 =
    './0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let result = '';

  while (--digits >= 0) {
    result += itoa64.charAt(value & 0x3f);
    value >>= 6;
  }

  return result;
};
