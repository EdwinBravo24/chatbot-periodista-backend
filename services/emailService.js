// services/emailService.js
const nodemailer = require('nodemailer');
require('dotenv').config();


// Configuración del transportador de Zoho
const transporter = nodemailer.createTransport({

  host: 'smtp.zoho.com',
  port: 587,
  secure: false, // true para 465, false para otros puertos
  auth: {
    user: process.env.ZOHO_EMAIL,
    pass: process.env.ZOHO_PASSWORD
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Función para verificar la conexión
const verificarConexion = async () => {
  try {
    await transporter.verify();
    console.log('✅ Servidor de email listo');
    return true;
  } catch (error) {
    console.error('❌ Error en configuración de email:', error);
    return false;
  }
};

// Función para formatear el historial a HTML
const formatearHistorialHTML = (historial, nombreUsuario) => {
  if (!historial || historial.length === 0) {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2c3e50;">Historial de Chat Deportivo - ${nombreUsuario}</h2>
        <p style="color: #7f8c8d;">No tienes conversaciones guardadas.</p>
      </div>
    `;
  }

  let conversacionesHTML = '';
  for (let i = 0; i < historial.length; i += 2) {
    const pregunta = historial[i];
    const respuesta = historial[i + 1];
    
    if (pregunta && respuesta) {
      conversacionesHTML += `
        <div style="margin-bottom: 25px; border-left: 4px solid #3498db; padding-left: 15px;">
          <div style="background-color: #f8f9fa; padding: 10px; border-radius: 5px; margin-bottom: 10px;">
            <strong style="color: #2980b9;">Tú:</strong>
            <p style="margin: 5px 0; color: #2c3e50;">${pregunta.text}</p>
          </div>
          <div style="background-color: #e8f5e8; padding: 10px; border-radius: 5px;">
            <strong style="color: #27ae60;">Simón (Bot Deportivo):</strong>
            <p style="margin: 5px 0; color: #2c3e50;">${respuesta.text}</p>
          </div>
        </div>
      `;
    }
  }

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #2c3e50; text-align: center; border-bottom: 2px solid #3498db; padding-bottom: 10px;">
        📊 Historial de Chat Deportivo
      </h2>
      <p style="color: #7f8c8d; text-align: center; margin-bottom: 30px;">
        Usuario: <strong>${nombreUsuario}</strong> | 
        Fecha de exportación: <strong>${new Date().toLocaleDateString('es-ES')}</strong>
      </p>
      <div style="background-color: #fff; border-radius: 10px; padding: 20px;">
        ${conversacionesHTML}
      </div>
      <div style="text-align: center; margin-top: 30px; padding: 15px; background-color: #f8f9fa; border-radius: 5px;">
        <p style="color: #7f8c8d; font-size: 12px;">
          Este historial fue generado automáticamente al cerrar sesión en Chat Deportivo.<br>
          Total de intercambios: ${Math.floor(historial.length / 2)}
        </p>
      </div>
    </div>
  `;
};

// Función principal para enviar historial
const enviarHistorialPorEmail = async (usuarioEmail, nombreUsuario, historial) => {
  try {
    // Verificar que el email esté configurado
    if (!process.env.ZOHO_EMAIL || !process.env.ZOHO_PASSWORD) {
      console.log('⚠️ Configuración de email no encontrada, saltando envío');
      return { success: false, message: 'Email no configurado' };
    }

    // Formatear historial como JSON para adjunto
    const historialJSON = JSON.stringify(historial, null, 2);
    
    // Crear el HTML del email
    const htmlContent = formatearHistorialHTML(historial, nombreUsuario);

    const mailOptions = {
      from: `"Chat Deportivo" <${process.env.ZOHO_EMAIL}>`,
      to: usuarioEmail,
      subject: `📊 Tu Historial de Chat Deportivo - ${nombreUsuario}`,
      html: htmlContent,
      attachments: [
        {
          filename: `historial_chat_${nombreUsuario}_${new Date().toISOString().split('T')[0]}.json`,
          content: historialJSON,
          contentType: 'application/json'
        }
      ]
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email enviado:', info.messageId);
    
    return { 
      success: true, 
      message: 'Historial enviado por email',
      messageId: info.messageId 
    };

  } catch (error) {
    console.error('❌ Error enviando email:', error);
    return { 
      success: false, 
      message: 'Error al enviar email',
      error: error.message 
    };
  }
};

module.exports = {
  enviarHistorialPorEmail,
  verificarConexion
};