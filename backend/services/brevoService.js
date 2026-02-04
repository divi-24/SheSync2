import axios from 'axios';

const BREVO_API_URL = 'https://api.brevo.com/v3';

/**
 * Send invitation email via Brevo
 * @param {string} recipientEmail - Email of the person being invited
 * @param {string} inviterName - Name of the person sending the invitation
 * @param {string} inviterEmail - Email of the inviter (for reply-to)
 * @param {string} type - 'parent' or 'partner'
 * @param {string} appUrl - App base URL for sign-up link
 */
export async function sendInvitationEmail(recipientEmail, inviterName, inviterEmail, type, appUrl = 'http://localhost:3000') {
  const BREVO_API_KEY = process.env.BREVO_API_KEY;
  if (!BREVO_API_KEY) {
    throw new Error('BREVO_API_KEY is not configured');
  }

  const templates = {
    parent: {
      subject: `${inviterName} invited you to track their health on SheSync`,
      htmlContent: `
        <html>
          <body style="font-family: Arial, sans-serif; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #ec4899;">Welcome to SheSync</h2>
              <p>Hi there,</p>
              <p><strong>${inviterName}</strong> (${inviterEmail}) has invited you to be a parent/guardian on <strong>SheSync</strong>, a women's health and wellness platform.</p>
              <p>As a parent, you'll be able to:</p>
              <ul>
                <li>Track and monitor health metrics</li>
                <li>Stay connected with their wellness journey</li>
                <li>Receive health insights and updates</li>
                <li>Support their health goals</li>
              </ul>
              <p style="margin-top: 30px;">
                <a href="${appUrl}/signup?role=parent&inviterEmail=${encodeURIComponent(inviterEmail)}" style="background-color: #ec4899; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                  Accept Invitation & Sign Up
                </a>
              </p>
              <p style="margin-top: 20px; font-size: 12px; color: #666;">
                This invitation will expire in 30 days. If you didn't expect this invitation, you can ignore this email.
              </p>
            </div>
          </body>
        </html>
      `
    },
    partner: {
      subject: `${inviterName} invited you to connect on SheSync`,
      htmlContent: `
        <html>
          <body style="font-family: Arial, sans-serif; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #ec4899;">Join SheSync</h2>
              <p>Hi there,</p>
              <p><strong>${inviterName}</strong> (${inviterEmail}) has invited you to connect on <strong>SheSync</strong>, a women's health and wellness platform.</p>
              <p>As a partner, you'll be able to:</p>
              <ul>
                <li>Stay informed about their wellness</li>
                <li>Provide support and encouragement</li>
                <li>Access health insights together</li>
                <li>Build a stronger health partnership</li>
              </ul>
              <p style="margin-top: 30px;">
                <a href="${appUrl}/signup?role=partner&inviterEmail=${encodeURIComponent(inviterEmail)}" style="background-color: #ec4899; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                  Accept Invitation & Sign Up
                </a>
              </p>
              <p style="margin-top: 20px; font-size: 12px; color: #666;">
                This invitation will expire in 30 days. If you didn't expect this invitation, you can ignore this email.
              </p>
            </div>
          </body>
        </html>
      `
    }
  };

  const template = templates[type];
  if (!template) {
    throw new Error(`Invalid invitation type: ${type}`);
  }

  try {
    const response = await axios.post(
      `${BREVO_API_URL}/smtp/email`,
      {
        sender: {
          name: 'SheSync',
          email: 'shesync.health@gmail.com'
        },
        to: [
          {
            email: recipientEmail,
            name: recipientEmail.split('@')[0]
          }
        ],
        replyTo: {
          email: inviterEmail,
          name: inviterName
        },
        subject: template.subject,
        htmlContent: template.htmlContent
      },
      {
        headers: {
          'api-key': BREVO_API_KEY,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log(`[Brevo] Invitation email sent to ${recipientEmail} (type: ${type})`);
    return {
      success: true,
      messageId: response.data.messageId
    };
  } catch (error) {
    console.error('[Brevo Error]', error.response?.data || error.message);
    throw new Error(`Failed to send invitation email: ${error.message}`);
  }
}

/**
 * Send acceptance notification email
 */
export async function sendAcceptanceNotificationEmail(inviterEmail, inviterName, accepterName, type) {
  const BREVO_API_KEY = process.env.BREVO_API_KEY;
  if (!BREVO_API_KEY) {
    throw new Error('BREVO_API_KEY is not configured');
  }

  const subject = `${accepterName} accepted your ${type} invitation on SheSync`;
  const htmlContent = `
    <html>
      <body style="font-family: Arial, sans-serif; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #ec4899;">Invitation Accepted!</h2>
          <p>Hi ${inviterName},</p>
          <p><strong>${accepterName}</strong> has accepted your ${type} invitation on SheSync.</p>
          <p>You can now stay connected and support each other's wellness journey together.</p>
          <p style="margin-top: 20px;">
            <a href="http://localhost:3000/dashboard" style="background-color: #ec4899; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Go to Dashboard
            </a>
          </p>
        </div>
      </body>
    </html>
  `;

  try {
    await axios.post(
      `${BREVO_API_URL}/smtp/email`,
      {
        sender: {
          name: 'SheSync',
          email: 'noreply@shesync.app'
        },
        to: [
          {
            email: inviterEmail,
            name: inviterName
          }
        ],
        subject,
        htmlContent
      },
      {
        headers: {
          'api-key': BREVO_API_KEY,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log(`[Brevo] Acceptance notification sent to ${inviterEmail}`);
  } catch (error) {
    console.error('[Brevo Error]', error.response?.data || error.message);
    // Don't throw - this is a non-critical notification
  }
}
