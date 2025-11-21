declare module 'jsonwebtoken' {
  export interface SignOptions {
    expiresIn?: string | number;
    algorithm?: string;
    [key: string]: any;
  }

  export interface VerifyOptions {
    algorithms?: string[];
    [key: string]: any;
  }

  export interface DecodeOptions {
    complete?: boolean;
    json?: boolean;
    [key: string]: any;
  }

  export interface JwtPayload {
    [key: string]: any;
    iss?: string;
    sub?: string;
    aud?: string | string[];
    exp?: number;
    nbf?: number;
    iat?: number;
    jti?: string;
  }

  export function sign(
    payload: string | Buffer | object,
    secretOrPrivateKey: string | Buffer,
    options?: SignOptions
  ): string;

  export function verify(
    token: string,
    secretOrPublicKey: string | Buffer,
    options?: VerifyOptions
  ): string | JwtPayload;

  export function decode(
    token: string,
    options?: DecodeOptions
  ): null | { [key: string]: any } | string;

  interface JsonWebToken {
    sign: typeof sign;
    verify: typeof verify;
    decode: typeof decode;
  }

  const jwt: JsonWebToken;
  export default jwt;
}

