const nodemailer = require('nodemailer');

const createTransporter = async () => {
    return nodemailer.createTransport({
        host: process.env.EMAIL_HOST || "smtp.gmail.com",
        port: process.env.EMAIL_PORT || 587,
        secure: process.env.EMAIL_PORT == 465, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
};

const sendAppointmentEmail = async (patientEmail, patientName, doctorName, appointmentDetails, type) => {
    try {
        const transporter = await createTransporter();
        
        let subject = '';
        let htmlContent = '';

        if (type === 'accepted') {
            subject = `Appointment Confirmed with ${doctorName}`;
            htmlContent = `
                <h2>Hello ${patientName},</h2>
                <p>Great news! Your appointment with <strong>${doctorName}</strong> has been confirmed.</p>
                <p><strong>Date:</strong> ${appointmentDetails.date}</p>
                <p><strong>Time:</strong> ${appointmentDetails.time}</p>
                <br/>
                <p>Please arrive 10 minutes early.</p>
                <p>Thank you,<br/>VitalNode Team</p>
            `;
        } else if (type === 'rescheduled') {
            subject = `Action Required: Appointment Rescheduled by ${doctorName}`;
            htmlContent = `
                <h2>Hello ${patientName},</h2>
                <p><strong>${doctorName}</strong> has suggested a new time for your appointment.</p>
                <p><strong>Suggested Date:</strong> ${appointmentDetails.suggestedDate}</p>
                <p><strong>Suggested Time:</strong> ${appointmentDetails.suggestedTime}</p>
                <p><strong>Doctor's Note:</strong> ${appointmentDetails.rescheduleMessage || 'No additional notes.'}</p>
                <br/>
                <p>Please log in to your VitalNode dashboard to Accept or Decline this new time.</p>
                <p>Thank you,<br/>VitalNode Team</p>
            `;
        } else if (type === 'finalized') {
             subject = `Appointment Reschedule Accepted - ${doctorName}`;
             htmlContent = `
                <h2>Hello ${patientName},</h2>
                <p>You have successfully accepted the new time slot for your appointment with <strong>${doctorName}</strong>.</p>
                <p><strong>Date:</strong> ${appointmentDetails.date}</p>
                <p><strong>Time:</strong> ${appointmentDetails.time}</p>
                <br/>
                <p>Thank you,<br/>VitalNode Team</p>
            `;
        }

        const info = await transporter.sendMail({
            from: '"VitalNode System" <noreply@vitalnode.com>',
            to: patientEmail || 'patient@example.com', // fallback for testing
            subject: subject,
            html: htmlContent,
        });

        console.log(`Email sent: ${info.messageId}`);
        console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    } catch (err) {
        console.error('Error sending email:', err);
    }
};

module.exports = { sendAppointmentEmail };
