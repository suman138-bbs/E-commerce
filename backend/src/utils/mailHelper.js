import config from "../config/index.js";
import transporter from "../config/transporter.config.js";

/**
 * @param  {} option
 * @description Send mail with [Nodemailer, mailtrap.io] for resetting password
 */

const mailHelper = async (option) => {
  const message = {
    from: config.SMTP_SENDER_EMAIL, // sender address
    to: option.email, // list of receivers
    subject: option.subject, // Subject line
    text: option.message, // plain text body
  };

  // send mail with defined transport object
  await transporter.sendMail(message);
};

export default mailHelper;
