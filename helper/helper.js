import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import nodemailer from "nodemailer";
const helper = {
  generateToken: (userData) => {
    const data = {
      user: {
        _id: userData._id,
      },
    };

    return jwt.sign(data, process.env.JWT_SECRET);
  },
  validatorMiddleware: (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }
    next();
  },
  dynamicMailer: async (email, subject, text) => {
    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,

      auth: {
        user: "marcellus42@ethereal.email",
        pass: "pyQFyAanQx5y1GmWz1",
      },
    });
    const info = await transporter.sendMail({
      from: '"Kalpit the great 👻" <marcellus42@ethereal.email>', // sender address
      to: email, // list of receivers
      subject: "Hello buddy", // Subject line
      text: text, // plain text body
      html: `<b>${text}</b>`, // html body
    });

    console.log("Message sent: %s", info.messageId);
    return info.messageId;
  },
};

export default helper;
