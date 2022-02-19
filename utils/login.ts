import {
  Header,
} from 'https://deno.land/x/djwt@v2.4/mod.ts';

const key = await crypto.subtle.generateKey(
  {name: "HMAC", hash: "SHA-512"},
  true,
  ["sign", "verify"],
);

const header: Header = {
  alg: "HS512",
  typ: "JWT"
};

export default {
  key,
  header
}