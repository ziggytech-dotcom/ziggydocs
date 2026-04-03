export function documentSigningEmailHtml({
  recipientName,
  documentTitle,
  signingLink,
  expiresAt,
  senderName = 'ZiggyDocs',
}: {
  recipientName: string
  documentTitle: string
  signingLink: string
  expiresAt: string
  senderName?: string
}): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Document Ready to Sign</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#111111;border:1px solid #222222;border-radius:16px;overflow:hidden;max-width:600px;width:100%;">
          <tr>
            <td style="background:#111111;border-bottom:1px solid #222222;padding:28px 36px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <p style="margin:0;font-size:26px;font-weight:800;letter-spacing:0.06em;color:#7c3aed;font-family:'Arial Black',sans-serif;">ZIGGYDOCS</p>
                    <p style="margin:4px 0 0;font-size:11px;color:#555555;letter-spacing:0.1em;text-transform:uppercase;">Secure Document Signing</p>
                  </td>
                  <td align="right">
                    <span style="background:#7c3aed22;color:#7c3aed;border:1px solid #7c3aed55;border-radius:6px;padding:4px 10px;font-size:11px;font-weight:600;letter-spacing:0.05em;text-transform:uppercase;">Action Required</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:36px;">
              <p style="margin:0 0 8px;font-size:13px;color:#555555;letter-spacing:0.08em;text-transform:uppercase;">Hello, ${recipientName}</p>
              <h1 style="margin:0 0 20px;font-size:24px;font-weight:700;color:#ffffff;line-height:1.3;">A document is ready<br/>for your signature</h1>
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;border:1px solid #222222;border-radius:12px;margin-bottom:28px;">
                <tr><td style="padding:20px 24px;">
                  <p style="margin:0 0 4px;font-size:11px;color:#555555;letter-spacing:0.1em;text-transform:uppercase;">Document</p>
                  <p style="margin:0;font-size:18px;font-weight:600;color:#ffffff;">${documentTitle}</p>
                </td></tr>
                <tr><td style="padding:0 24px 20px;">
                  <p style="margin:0;font-size:12px;color:#555555;">Prepared by ${senderName} · Expires ${expiresAt}</p>
                </td></tr>
              </table>
              <p style="margin:0 0 24px;font-size:14px;color:#b3b3b3;line-height:1.6;">Please review the document carefully and complete all required signature fields. Your electronic signature is legally binding.</p>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr><td align="center">
                  <a href="${signingLink}" style="display:inline-block;background:#7c3aed;color:#ffffff;text-decoration:none;padding:15px 48px;border-radius:12px;font-size:15px;font-weight:700;letter-spacing:0.02em;">Review &amp; Sign Document →</a>
                </td></tr>
              </table>
              <p style="margin:24px 0 0;font-size:12px;color:#555555;text-align:center;">Or copy this link:<br/><a href="${signingLink}" style="color:#7c3aed;word-break:break-all;">${signingLink}</a></p>
            </td>
          </tr>
          <tr>
            <td style="background:#0a0a0a;border-top:1px solid #222222;padding:20px 36px;">
              <p style="margin:0;font-size:11px;color:#444444;line-height:1.6;">Sent via ZiggyDocs. If you didn't expect this document, please ignore this email.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

export function reminderEmailHtml({
  recipientName,
  documentTitle,
  signingLink,
  reminderNumber,
  expiresAt,
  senderName = 'ZiggyDocs',
}: {
  recipientName: string
  documentTitle: string
  signingLink: string
  reminderNumber: number
  expiresAt: string
  senderName?: string
}): string {
  const ordinal = reminderNumber === 1 ? '1st' : reminderNumber === 2 ? '2nd' : '3rd'
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Reminder: Document Awaiting Signature</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#111111;border:1px solid #222222;border-radius:16px;overflow:hidden;max-width:600px;width:100%;">
          <tr>
            <td style="background:#111111;border-bottom:1px solid #222222;padding:28px 36px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <p style="margin:0;font-size:26px;font-weight:800;letter-spacing:0.06em;color:#7c3aed;font-family:'Arial Black',sans-serif;">ZIGGYDOCS</p>
                    <p style="margin:4px 0 0;font-size:11px;color:#555555;letter-spacing:0.1em;text-transform:uppercase;">Secure Document Signing</p>
                  </td>
                  <td align="right">
                    <span style="background:#f59e0b22;color:#f59e0b;border:1px solid #f59e0b55;border-radius:6px;padding:4px 10px;font-size:11px;font-weight:600;letter-spacing:0.05em;text-transform:uppercase;">${ordinal} Reminder</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:36px;">
              <p style="margin:0 0 8px;font-size:13px;color:#555555;letter-spacing:0.08em;text-transform:uppercase;">Hello, ${recipientName}</p>
              <h1 style="margin:0 0 20px;font-size:24px;font-weight:700;color:#ffffff;line-height:1.3;">This document is still<br/>awaiting your signature</h1>
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;border:1px solid #222222;border-radius:12px;margin-bottom:28px;">
                <tr><td style="padding:20px 24px;">
                  <p style="margin:0 0 4px;font-size:11px;color:#555555;letter-spacing:0.1em;text-transform:uppercase;">Document</p>
                  <p style="margin:0;font-size:18px;font-weight:600;color:#ffffff;">${documentTitle}</p>
                </td></tr>
                <tr><td style="padding:0 24px 20px;">
                  <p style="margin:0;font-size:12px;color:#555555;">Prepared by ${senderName} · Expires ${expiresAt}</p>
                </td></tr>
              </table>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr><td align="center">
                  <a href="${signingLink}" style="display:inline-block;background:#7c3aed;color:#ffffff;text-decoration:none;padding:15px 48px;border-radius:12px;font-size:15px;font-weight:700;letter-spacing:0.02em;">Review &amp; Sign Now →</a>
                </td></tr>
              </table>
              <p style="margin:24px 0 0;font-size:12px;color:#555555;text-align:center;">Or copy this link:<br/><a href="${signingLink}" style="color:#7c3aed;word-break:break-all;">${signingLink}</a></p>
            </td>
          </tr>
          <tr>
            <td style="background:#0a0a0a;border-top:1px solid #222222;padding:20px 36px;">
              <p style="margin:0;font-size:11px;color:#444444;line-height:1.6;">Sent via ZiggyDocs. If you didn't expect this document, please ignore this email.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

export function declineNotificationEmailHtml({
  ownerName,
  documentTitle,
  recipientName,
  declineReason,
}: {
  ownerName: string
  documentTitle: string
  recipientName: string
  declineReason: string
}): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#111111;border:1px solid #222222;border-radius:16px;overflow:hidden;max-width:600px;width:100%;">
        <tr><td style="padding:28px 36px;border-bottom:1px solid #222222;">
          <p style="margin:0;font-size:26px;font-weight:800;letter-spacing:0.06em;color:#7c3aed;font-family:'Arial Black',sans-serif;">ZIGGYDOCS</p>
        </td></tr>
        <tr><td style="padding:36px;">
          <div style="background:#f97316/10;background-color:rgba(249,115,22,0.1);border:1px solid rgba(249,115,22,0.3);border-radius:12px;padding:16px 20px;margin-bottom:24px;">
            <p style="margin:0;color:#f97316;font-weight:700;font-size:14px;">✕ Signing Declined</p>
          </div>
          <p style="margin:0 0 8px;font-size:13px;color:#555;letter-spacing:0.08em;text-transform:uppercase;">Hi ${ownerName},</p>
          <h1 style="margin:0 0 20px;font-size:22px;font-weight:700;color:#ffffff;">"${documentTitle}"</h1>
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;border:1px solid #222222;border-radius:12px;margin-bottom:24px;">
            <tr><td style="padding:16px 20px 8px;">
              <p style="margin:0 0 4px;font-size:11px;color:#555;text-transform:uppercase;letter-spacing:0.1em;">Declined by</p>
              <p style="margin:0;color:#fff;font-weight:600;">${recipientName}</p>
            </td></tr>
            <tr><td style="padding:8px 20px 16px;">
              <p style="margin:0 0 4px;font-size:11px;color:#555;text-transform:uppercase;letter-spacing:0.1em;">Reason given</p>
              <p style="margin:0;color:#b3b3b3;font-style:italic;">"${declineReason}"</p>
            </td></tr>
          </table>
          <p style="margin:0;font-size:13px;color:#888;">You may want to follow up with ${recipientName} or resend the document to other recipients.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

export function adminSignedNotificationHtml({
  recipientName,
  documentTitle,
  signedAt,
  signerName,
  downloadLink,
}: {
  recipientName: string
  documentTitle: string
  signedAt: string
  signerName: string
  downloadLink?: string
}): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#111111;border:1px solid #222222;border-radius:16px;overflow:hidden;max-width:600px;width:100%;">
        <tr><td style="padding:28px 36px;border-bottom:1px solid #222222;">
          <p style="margin:0;font-size:26px;font-weight:800;letter-spacing:0.06em;color:#7c3aed;font-family:'Arial Black',sans-serif;">ZIGGYDOCS</p>
        </td></tr>
        <tr><td style="padding:36px;">
          <div style="background:#22c55e22;border:1px solid #22c55e55;border-radius:12px;padding:16px 20px;margin-bottom:24px;">
            <p style="margin:0;color:#22c55e;font-weight:700;font-size:14px;">✓ Document Signed</p>
          </div>
          <h1 style="margin:0 0 20px;font-size:22px;font-weight:700;color:#ffffff;">"${documentTitle}" has been signed</h1>
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;border:1px solid #222222;border-radius:12px;margin-bottom:24px;">
            <tr><td style="padding:16px 20px 8px;">
              <p style="margin:0 0 4px;font-size:11px;color:#555;text-transform:uppercase;letter-spacing:0.1em;">Signed by</p>
              <p style="margin:0;color:#fff;font-weight:600;">${signerName}</p>
            </td></tr>
            <tr><td style="padding:8px 20px 16px;">
              <p style="margin:0 0 4px;font-size:11px;color:#555;text-transform:uppercase;letter-spacing:0.1em;">Signed at</p>
              <p style="margin:0;color:#b3b3b3;">${signedAt}</p>
            </td></tr>
          </table>
          ${downloadLink ? `<a href="${downloadLink}" style="display:inline-block;background:#7c3aed;color:#fff;text-decoration:none;padding:13px 32px;border-radius:10px;font-size:14px;font-weight:700;">Download Signed PDF →</a>` : ''}
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

export function voidNotificationEmailHtml({
  ownerName,
  documentTitle,
  expiredAt,
}: {
  ownerName: string
  documentTitle: string
  expiredAt: string
}): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#111111;border:1px solid #222222;border-radius:16px;overflow:hidden;max-width:600px;width:100%;">
        <tr><td style="padding:28px 36px;border-bottom:1px solid #222222;">
          <p style="margin:0;font-size:26px;font-weight:800;letter-spacing:0.06em;color:#7c3aed;font-family:'Arial Black',sans-serif;">ZIGGYDOCS</p>
        </td></tr>
        <tr><td style="padding:36px;">
          <div style="background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.3);border-radius:12px;padding:16px 20px;margin-bottom:24px;">
            <p style="margin:0;color:#f87171;font-weight:700;font-size:14px;">⊘ Document Voided</p>
          </div>
          <p style="margin:0 0 8px;font-size:13px;color:#555;letter-spacing:0.08em;text-transform:uppercase;">Hi ${ownerName},</p>
          <h1 style="margin:0 0 20px;font-size:22px;font-weight:700;color:#ffffff;">A document has expired and been voided</h1>
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;border:1px solid #222222;border-radius:12px;margin-bottom:24px;">
            <tr><td style="padding:16px 20px 8px;">
              <p style="margin:0 0 4px;font-size:11px;color:#555;text-transform:uppercase;letter-spacing:0.1em;">Document</p>
              <p style="margin:0;color:#fff;font-weight:600;">${documentTitle}</p>
            </td></tr>
            <tr><td style="padding:8px 20px 16px;">
              <p style="margin:0 0 4px;font-size:11px;color:#555;text-transform:uppercase;letter-spacing:0.1em;">Expired on</p>
              <p style="margin:0;color:#b3b3b3;">${expiredAt}</p>
            </td></tr>
          </table>
          <p style="margin:0;font-size:13px;color:#888;">The document was not fully signed before its expiration date. You may create a new document if the signatures are still needed.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

export function signerConfirmationEmailHtml({
  signerName,
  documentTitle,
  signedAt,
  downloadLink,
}: {
  signerName: string
  documentTitle: string
  signedAt: string
  downloadLink?: string
}): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#111111;border:1px solid #222222;border-radius:16px;overflow:hidden;max-width:600px;width:100%;">
        <tr><td style="padding:28px 36px;border-bottom:1px solid #222222;">
          <p style="margin:0;font-size:26px;font-weight:800;letter-spacing:0.06em;color:#7c3aed;font-family:'Arial Black',sans-serif;">ZIGGYDOCS</p>
        </td></tr>
        <tr><td style="padding:36px;">
          <div style="background:#22c55e22;border:1px solid #22c55e55;border-radius:12px;padding:16px 20px;margin-bottom:24px;">
            <p style="margin:0;color:#22c55e;font-weight:700;">✓ Your signature has been recorded</p>
          </div>
          <p style="margin:0 0 8px;font-size:13px;color:#555;letter-spacing:0.08em;text-transform:uppercase;">Hi ${signerName},</p>
          <h1 style="margin:0 0 20px;font-size:22px;font-weight:700;color:#fff;">You've successfully signed</h1>
          <p style="margin:0 0 8px;color:#b3b3b3;font-size:15px;">"${documentTitle}"</p>
          <p style="margin:0 0 24px;color:#555;font-size:13px;">Signed: ${signedAt}</p>
          ${downloadLink ? `<a href="${downloadLink}" style="display:inline-block;background:#7c3aed;color:#fff;text-decoration:none;padding:13px 32px;border-radius:10px;font-size:14px;font-weight:700;">Download Your Copy →</a>` : ''}
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}
