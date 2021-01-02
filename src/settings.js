import dotenv from 'dotenv';

dotenv.config();

export const testEnvironmentVariable = process.env.TEST_ENV_VAR;
export const dbRelPath = process.env.DB_PATH;
export const mailbox = process.env.MAILBOX;
export const mailUser = process.env.MAIL_USER;
export const mailPass = process.env.MAIL_PASS;
export const mailHost = process.env.MAIL_HOST;
export const mailPort = process.env.MAIL_PORT;
