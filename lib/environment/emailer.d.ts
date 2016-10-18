import { EmailOptions } from "./emailOptions";
import { EmailCredentials } from "./emailCredentials";
import { Environment } from "./environment";
/**
 * Emailing service
 */
export declare class Emailer {
    protected e: Environment;
    protected connection: any;
    protected credentials: any;
    constructor(e: Environment, credentials: EmailCredentials);
    /**
     * Collects options a executes nodemailer.
     * @param options {EmailOptions}
     */
    sendMail(options: EmailOptions): void;
    /**
     * Send an email with nodemailer.
     * @param nodemailerOptions
     */
    protected executeSend(nodemailerOptions: any): void;
    /**
     * This finds and compiles a path to a jade template and returns HTML in the callback.
     * @param filePath {string}     The path to the file.
     * @param data {object}    Used for passing variables to jade template
     * @param callback     returns the complied jade template as html
     */
    private compileJade(filePath, data, callback);
}
