import { crypt } from './crypt3-md5';

describe('Crypt(3) MD5', () => {
  it('should retrun proper MD5 hash', () => {
    expect(crypt('test', '$1$abcdefgh$')).toEqual(
      '$1$abcdefgh$irWbblnpmw.5z7wgBnprh0',
    );
    expect(crypt('P@$$w0rd', '$1$2137JP2$')).toEqual(
      '$1$2137JP2$Gqv0v0q/pK3SEOA4tM4T8.',
    );
    expect(crypt('not salty password')).toEqual('$1$$IObRb8Uen32kklOUL1C78.');
  });
});
