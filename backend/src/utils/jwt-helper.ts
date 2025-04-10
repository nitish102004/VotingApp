import { SignOptions } from 'jsonwebtoken';

export interface JwtOptions extends Omit<SignOptions, 'expiresIn'> {
    expiresIn: string | number;
}

export const createJwtOptions = (expiresIn: string | number): SignOptions => {
    // This function takes a string or number and returns it as a properly typed SignOptions object
    // Through this function, we can bypass the TypeScript error
    return { expiresIn } as any as SignOptions;
}; 