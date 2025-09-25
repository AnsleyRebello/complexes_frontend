// Email service for appointment notifications
import emailjs from '@emailjs/browser'

export class EmailService {
  static ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'admin@example.com'
  
  // EmailJS configuration
  static EMAILJS_CONFIG = {
    serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || 'demo_service',
    publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'demo_key',
    adminTemplateId: import.meta.env.VITE_EMAILJS_ADMIN_TEMPLATE || 'demo_template',
    userTemplateId: import.meta.env.VITE_EMAILJS_USER_TEMPLATE || 'demo_template'
  }

  // Initialize EmailJS
  static init() {
    try {
      emailjs.init(this.EMAILJS_CONFIG.publicKey)
      console.log('📧 EmailJS initialized successfully')
    } catch (error) {
      console.error('Failed to initialize EmailJS:', error)
    }
  }
  
  // Send appointment notification to admin
  static async sendAppointmentNotification(appointmentData) {
    try {
      // Prepare email template parameters
      const templateParams = {
        to_email: this.ADMIN_EMAIL,
        to_name: 'Admin',
        from_name: appointmentData.userName,
        from_email: appointmentData.userEmail,
        from_phone: appointmentData.userPhone,
        building_name: appointmentData.buildingName,
        building_location: appointmentData.buildingLocation,
        appointment_time: new Date(appointmentData.appointmentTime).toLocaleString(),
        meeting_mode: appointmentData.mode === 'physical' ? 'In-Person Visit' : 'Online Meeting',
        user_message: appointmentData.message || 'Looking forward to viewing this property.',
        subject: `New Appointment Request - ${appointmentData.buildingName}`
      }

      console.log('📧 Attempting to send email to admin:', templateParams)

      // Try to send via EmailJS (if configured)
      if (this.EMAILJS_CONFIG.publicKey !== 'demo_key') {
        try {
          const response = await emailjs.send(
            this.EMAILJS_CONFIG.serviceId,
            this.EMAILJS_CONFIG.adminTemplateId,
            templateParams
          )
          
          console.log('✅ EmailJS response:', response)
          return {
            success: true,
            message: 'Real email sent to admin successfully via EmailJS!',
            emailData: templateParams
          }
        } catch (emailjsError) {
          console.error('❌ EmailJS failed:', emailjsError)
          // Fall back to simulation
        }
      }

      // Fallback: Show detailed console output for now
      console.log('📧 EMAIL THAT WOULD BE SENT TO ADMIN:')
      console.log('====================================')
      console.log(`TO: ${this.ADMIN_EMAIL}`)
      console.log(`SUBJECT: ${templateParams.subject}`)
      console.log('BODY:')
      console.log(this.generateEmailBody(appointmentData))
      console.log('====================================')
      
      return {
        success: true,
        message: 'Email notification logged (EmailJS not configured yet)',
        emailData: templateParams
      }
    } catch (error) {
      console.error('Failed to send email notification:', error)
      return {
        success: false,
        message: 'Failed to send email notification',
        error: error.message
      }
    }
  }

  // Generate email body for appointment notification
  static generateEmailBody(appointmentData) {
    const { 
      userName, 
      userEmail, 
      userPhone, 
      buildingName, 
      buildingLocation, 
      appointmentTime, 
      mode, 
      message 
    } = appointmentData

    return `
Dear Admin,

A new appointment has been requested on the Clement Regency Developers platform.

APPOINTMENT DETAILS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🏢 Property: ${buildingName}
📍 Location: ${buildingLocation}
📅 Requested Date & Time: ${new Date(appointmentTime).toLocaleString()}
🎯 Meeting Mode: ${mode === 'physical' ? 'In-Person Visit' : 'Online Meeting'}

CUSTOMER DETAILS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👤 Name: ${userName}
📧 Email: ${userEmail}
📱 Phone: ${userPhone}

${message ? `💬 Message: ${message}` : ''}

NEXT STEPS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Contact the customer to confirm the appointment
2. Update the appointment status in the admin panel
3. Send confirmation details to the customer

Please log into the admin dashboard to manage this appointment request.

Best regards,
Clement Regency Developers System
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

This is an automated message. Please do not reply to this email.
    `.trim()
  }

  // Send appointment confirmation to user
  static async sendAppointmentConfirmation(appointmentData, adminMessage = '') {
    try {
      const templateParams = {
        to_email: appointmentData.userEmail,
        to_name: appointmentData.userName,
        from_name: 'Clement Regency Developers',
        building_name: appointmentData.buildingName,
        building_location: appointmentData.buildingLocation,
        appointment_time: new Date(appointmentData.appointmentTime).toLocaleString(),
        meeting_mode: appointmentData.mode === 'physical' ? 'In-Person Visit' : 'Online Meeting',
        admin_message: adminMessage || 'Looking forward to meeting with you!',
        subject: `Appointment Confirmed - ${appointmentData.buildingName}`
      }

      console.log('📧 Attempting to send confirmation to user:', templateParams)

      // Try to send via EmailJS (if configured)
      if (this.EMAILJS_CONFIG.publicKey !== 'demo_key') {
        try {
          const response = await emailjs.send(
            this.EMAILJS_CONFIG.serviceId,
            this.EMAILJS_CONFIG.userTemplateId,
            templateParams
          )
          
          console.log('✅ User confirmation EmailJS response:', response)
          return {
            success: true,
            message: 'Real confirmation email sent to user via EmailJS!',
            emailData: templateParams
          }
        } catch (emailjsError) {
          console.error('❌ EmailJS confirmation failed:', emailjsError)
          // Fall back to simulation
        }
      }

      // Fallback: Show detailed console output
      console.log('📧 CONFIRMATION EMAIL THAT WOULD BE SENT TO USER:')
      console.log('===========================================')
      console.log(`TO: ${appointmentData.userEmail}`)
      console.log(`SUBJECT: ${templateParams.subject}`)
      console.log('BODY:')
      console.log(this.generateConfirmationBody(appointmentData, adminMessage))
      console.log('===========================================')
      
      return {
        success: true,
        message: 'Confirmation email logged (EmailJS not configured yet)',
        emailData: templateParams
      }
    } catch (error) {
      console.error('Failed to send confirmation email:', error)
      return {
        success: false,
        message: 'Failed to send confirmation email',
        error: error.message
      }
    }
  }

  // Generate confirmation email body
  static generateConfirmationBody(appointmentData, adminMessage) {
    const { 
      userName, 
      buildingName, 
      buildingLocation, 
      appointmentTime, 
      mode 
    } = appointmentData

    return `
Dear ${userName},

Your appointment request has been confirmed!

APPOINTMENT CONFIRMATION:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🏢 Property: ${buildingName}
📍 Location: ${buildingLocation}
📅 Date & Time: ${new Date(appointmentTime).toLocaleString()}
🎯 Meeting Mode: ${mode === 'physical' ? 'In-Person Visit' : 'Online Meeting'}

${adminMessage ? `💬 Message from our team: ${adminMessage}` : ''}

IMPORTANT REMINDERS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${mode === 'physical' 
  ? '• Please arrive 10 minutes early for your appointment\n• Bring a valid ID for verification\n• Feel free to ask any questions during your visit' 
  : '• You will receive a meeting link closer to the appointment time\n• Ensure you have a stable internet connection\n• Prepare any questions you may have about the property'
}

Need to reschedule or cancel? Contact us at:
📞 ${import.meta.env.VITE_COMPANY_PHONE || '+91-XXXXXXXXXX'}
📧 ${import.meta.env.VITE_COMPANY_EMAIL || 'info@example.com'}

Thank you for choosing Clement Regency Developers!

Best regards,
The Clement Regency Team
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `.trim()
  }
}

export default EmailService