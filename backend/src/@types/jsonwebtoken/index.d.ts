// This augments the existing jsonwebtoken module types
import { Secret, SignOptions as OriginalSignOptions } from 'jsonwebtoken';

declare module 'jsonwebtoken' {
  interface SignOptions extends OriginalSignOptions {
    expiresIn?: string | number;
  }
} 