export async function onRequestPost(context) {
  try {
    const request = context.request;
    const body = await request.json();

    const { email, projectName, inviteLink, role, senderName } = body;

    if (!email || !projectName) {
      return new Response(JSON.stringify({ success: false, error: 'Email and project name are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Attempt direct HTTP REST dispatch if RESEND_API_KEY is configured in Cloudflare Environment
    const resendApiKey = context.env.RESEND_API_KEY;

    if (resendApiKey) {
      const emailResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'Google Cloud Hub <onboarding@resend.dev>',
          to: [email],
          subject: `Undangan Bergabung ke Proyek: ${projectName}`,
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #202124;">
              <h2 style="color: #1a73e8;">Undangan Akses Proyek ${projectName}</h2>
              <p>Halo,</p>
              <p><strong>${senderName || 'Tim Proyek'}</strong> mengundang Anda untuk bergabung ke dalam proyek <strong>${projectName}</strong> sebagai <strong>${role}</strong>.</p>
              <p style="margin: 24px 0;">
                <a href="${inviteLink}" style="background-color: #1a73e8; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                  Buka Proyek & Terima Akses
                </a>
              </p>
              <p style="font-size: 12px; color: #70757a;">Atau salin tautan berikut ke browser Anda: ${inviteLink}</p>
            </div>
          `
        })
      });

      const emailData = await emailResponse.json();
      return new Response(JSON.stringify({ success: true, method: 'direct-api', data: emailData }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Default response if API key not set yet
    return new Response(JSON.stringify({ 
      success: true, 
      method: 'link-generated', 
      inviteLink,
      message: 'Invitation generated successfully' 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
