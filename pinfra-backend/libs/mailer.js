const env = require("../config/env");
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const { responseMessage } = require("./responseMessages");

const options = {
    host: env.smtp.host,
    port: env.smtp.port,
    auth: {
        user: env.smtp.auth_user,
        pass: env.smtp.auth_pass
    }
};

async function send(opt) {
    try {     
        let optionsDetail = options;
        let transporter = await nodemailer.createTransport(optionsDetail);       
        return await mailer(opt, transporter);
    } catch (err) {
        throw  new Error(err)
    }
}


async function mailer(opt, transporter) {

        try {
            let options = {
                viewEngine: {
                    extname: '.hbs',
                    layoutsDir: './emails/',
                    defaultLayout: 'index',
                    partialsDir: './emails/partials',
                    helpers: {
                        logo_url: function () {
                            return opt.logo;
                        }
                    }
                },
                viewPath: './emails/body/',
                extName: '.hbs',
            };
    
            let email_obj = {
                from: env.smtp.from,
                to: opt.to,
                subject: opt.subject,
            };
    
    
            if (opt.cc) {
                email_obj.cc = opt.cc;
            }
    
            if (opt.text) {
                email_obj.text = opt.text;
            }
            if (opt.html) {
                email_obj.html = opt.html;
            }
    
            if (opt.template) {
                email_obj.template = opt.template;
            }
    
            if (opt.attachments) {
                email_obj.attachments = opt.attachments;
            }
    
            if (opt.context) {
                email_obj.context = opt.context;
            }
    
            transporter.use('compile', hbs(options));    
            let mailsent = await transporter.sendMail(email_obj);    
            return mailsent;
        } catch (err) {           
            throw  new Error(err)
        }


   

}


module.exports = {
    sendMail: send
}