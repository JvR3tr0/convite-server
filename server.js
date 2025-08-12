import express from "express";
import bodyParser from "body-parser";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Rota para confirmar presença
app.post("/confirmar", async (req, res) => {
  const { nome, email, acompanhante } = req.body;

  try {
    // Transporter do Nodemailer (usando Gmail como exemplo)
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Email para você
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "Nova Confirmação de Presença",
      text: `Nome: ${nome}\nEmail: ${email}\nAcompanhante: ${acompanhante}`
    });

    // Email para o convidado
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Confirmação de Presença",
      text: `Olá ${nome}, sua presença foi confirmada. Acompanhante: ${acompanhante}`
    });

    res.json({ message: "Confirmação enviada com sucesso!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao enviar e-mail." });
  }
});

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
