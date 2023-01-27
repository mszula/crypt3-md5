# Crypt(3) MD5 hashing algorithm in TypeScript

Simple implementation of [Crypt(3)](https://man7.org/linux/man-pages/man3/crypt.3.html) MD5 hashing method from glib fully written in TypeScript without any dependency.
The function allows to generate `$1$` at the beginning of password hashes, and is fully compatible with `crypt` function in [PHP](https://www.php.net/manual/en/function.crypt.php).

## Installation

```sh
npm install crypt3-md5
```

## Quick Start 🚀

🧂 Hash password with salt

```ts
import { crypt } from 'crypt3-md5';

const cryptMd5 = crypt('password', '$1$abcdefgh$'); // '$1$abcdefgh$irWbblnpmw.5z7wgBnprh0'
```

Hash password without salt

```ts
import { crypt } from 'crypt3-md5';

const cryptMd5 = crypt('not salty password'); // '$1$$IObRb8Uen32kklOUL1C78.'
```

## Thanks

- Thanks for unknown user which developed the algorithm in JS and pasted it [here](https://pastebin.com/V4R5r9pi).
- Also inspired with:
  - https://code.activestate.com/recipes/325204-passwd-file-compatible-1-md5-crypt/
  - https://www.npmjs.com/package/cryptmd5
