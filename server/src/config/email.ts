import nodemailer from "nodemailer";

const { HOST, USER, PASSWORD, MY_EMAIL } = process.env;

if (!HOST || !USER || !PASSWORD || !MY_EMAIL) {
  throw new Error("Mail info undefined");
}

const transporter = nodemailer.createTransport({
  host: HOST,
  port: 2525,
  secure: false,
  auth: {
    user: USER,
    pass: PASSWORD,
  },
});

const sendMail = async (
  from: string,
  subject: string,
  html: string,
  to = MY_EMAIL
) => {
  try {
    const mail = await transporter.sendMail({
      from,
      to,
      subject,
      html,
    });

    console.log("Email sent successfully : ", mail.messageId);
  } catch (error) {
    console.log("Error caught : ", error);
  }
};

export default sendMail;
