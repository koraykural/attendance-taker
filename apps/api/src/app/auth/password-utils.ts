import { hashSync, compareSync, genSaltSync } from 'bcrypt';

const salt = genSaltSync();

export const hash = (password: string): string => hashSync(password, salt);
export const compare = (password: string, hash: string): boolean => compareSync(password, hash);
