import * as crypto from 'crypto';

const SALT_MAXLEN = 8;
const MD5_MAGIC_STRING = '$1$';

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

export const crypt = (password: string, salt: string = '') => {
  const parsedSalt = parseSalt(salt);

  const mainContext = crypto.createHash('md5');
  mainContext.update(password + MD5_MAGIC_STRING + parsedSalt);

  const additionalContext = crypto.createHash('md5');
  additionalContext.update(password + parsedSalt + password);

  const additionalContextBuffer = additionalContext.digest();
  for (let i = 0; i < password.length; i++) {
    mainContext.update(
      String.fromCharCode(additionalContextBuffer[i % 16]),
      'binary',
    );
  }

  for (let i = password.length; i; i >>= 1) {
    mainContext.update(i & 1 ? '\x00' : password[0]);
  }

  let mainContextBuffer = mainContext.digest();

  for (let i = 0; i < 1000; i++) {
    const context = crypto.createHash('md5');

    if (i & 1) {
      context.update(password);
    } else {
      context.update(mainContextBuffer);
    }

    if (i % 3) {
      context.update(parsedSalt);
    }

    if (i % 7) {
      context.update(password);
    }

    if (i & 1) {
      context.update(mainContextBuffer);
    } else {
      context.update(password);
    }

    mainContextBuffer = context.digest();
  }

  return (
    MD5_MAGIC_STRING +
    parsedSalt +
    '$' +
    to64(
      (mainContextBuffer[0] << 16) |
        (mainContextBuffer[6] << 8) |
        mainContextBuffer[12],
      4,
    ) +
    to64(
      (mainContextBuffer[1] << 16) |
        (mainContextBuffer[7] << 8) |
        mainContextBuffer[13],
      4,
    ) +
    to64(
      (mainContextBuffer[2] << 16) |
        (mainContextBuffer[8] << 8) |
        mainContextBuffer[14],
      4,
    ) +
    to64(
      (mainContextBuffer[3] << 16) |
        (mainContextBuffer[9] << 8) |
        mainContextBuffer[15],
      4,
    ) +
    to64(
      (mainContextBuffer[4] << 16) |
        (mainContextBuffer[10] << 8) |
        mainContextBuffer[5],
      4,
    ) +
    to64(mainContextBuffer[11], 2)
  );
};
