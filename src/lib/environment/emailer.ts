import {EmailOptions} from "./emailOptions";
import {EmailCredentials} from "./emailCredentials";
import {Environment} from "./environment";

const   nodemailer = require("nodemailer"),
        jade = require("jade");

/**
 * Emailing service
 */
export class Emailer {

    protected e: Environment;
    protected connection: any;
    protected credentials: any;

    constructor(e: Environment, credentials: EmailCredentials) {
        this.e = e;
        this.credentials = credentials;
        // console.log(this.credentials);
        // console.log(credentials.service);
        this.connection = nodemailer.createTransport(credentials.transportMethod, {
            service: credentials.service,  // sets automatically host, port and connection security settings
            auth: {
                user: credentials.username,
                pass: credentials.password
            }
        });
    }

    /**
     * Collects options a executes nodemailer.
     * @param options {EmailOptions}
     */
    public sendMail(options: EmailOptions): void {
        let ms = this;
        let variableData;

        // Initialize nodemailer options
        let nodemailerOptions = {
            to: options.to,
            cc: options.cc,
            bcc: options.bcc,
            subject: options.subject,
            html: null,
            text: null
        };

        // Get email body and execute
        if (options.template) {
            ms.compileJade(options.template, variableData, (html) => {
                nodemailerOptions.html = html;
                ms.executeSend(nodemailerOptions);
            });
        } else if (options.html) {
            nodemailerOptions.html = options.html;
            ms.executeSend(nodemailerOptions);
        } else if (options.text) {
            nodemailerOptions.text = options.text;
            ms.executeSend(nodemailerOptions);
        } else {
            ms.e.log(3, `Error sending mail. Template or email body not set in email options.`, ms);
        }

    }

    /**
     * Send an email with nodemailer.
     * @param nodemailerOptions
     */
    protected executeSend(nodemailerOptions: any) {
        let ms = this;
        ms.connection.sendMail(nodemailerOptions, (nmError, nmResponse) => {
            if (nmError) {
                ms.e.log(3, `nodemailer sending error: ${nmError}`, ms);
            } else {
                ms.e.log(0, `Email sent. ${nmResponse.message}`, ms);
            }
        });
        ms.connection.close(); // shut down the connection pool, no more messages.  Comment this line out to continue sending emails.
    }

    /**
     * This finds and compiles a path to a jade template and returns HTML in the callback.
     * @param filePath {string}     The path to the file.
     * @param data {object}    Used for passing variables to jade template
     * @param callback     returns the complied jade template as html
     */
    private compileJade(filePath: string, data: any, callback: any): void {
        let ms = this;
        // filePath = process.cwd() + "/email-templates" + filePath;
        jade.renderFile(filePath, data, (err, compiledTemplate) => {
            if (err) {
                ms.e.log(3, `pug rendering error: ${err}`, ms);
            } else {
                callback(compiledTemplate);
            }
        });

    }

}
