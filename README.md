# Crypt(3) MD5 hashing algorithm in TypeScript

Simple implementation of [Crypt(3)](https://man7.org/linux/man-pages/man3/crypt.3.html) MD5 hashing method from glib fully written in TypeScript.
Inspired with `crypt` function in [PHP](https://www.php.net/manual/en/function.crypt.php)

## Installation

```sh
npm install @mszula/crypt3-md5
```

## Quick Start 🚀

🧂 Hash password with salt

```ts
import { crypt } from '@mszula/crypt3-md5';

const cryptMd5 = crypt('password', '$1$abcdefgh$');
```

Hash password without salt

```ts
import { crypt } from '@mszula/crypt3-md5';

const cryptMd5 = crypt('not salty password');
```

## Thanks

Thanks for unknown user which developed the algorithm in JS and pasted it [here](https://pastebin.com/V4R5r9pi).
