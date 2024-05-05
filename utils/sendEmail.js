const nodemailer = require('nodemailer')
const sendEmail =async options=>{
    const transport = nodemailer.createTransport({
        service:"gmail",
        host: "smtp.gmail.com",
        port: "587",
        secure: false,
        auth: {
          user: "rahatulwork@gmail.com",
          pass: "skvejhcbfqumfgxy"
        }
      });
      const message={
        from:`${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
        to:options.email,
        subject:options.subject,
        text:options.message,
      }
      await transport.sendMail(message)
}
module.exports = sendEmail