// lib/emailTemplates.ts

/**
 * Genera un template HTML bonito para emails
 * Usa estilos inline para compatibilidad con clientes de email
 */
export function generateEmailTemplate(content: {
    title: string;
    message: string;
    buttonText?: string;
    buttonLink?: string;
    footerText?: string;
}): string {
    const { title, message, buttonText, buttonLink, footerText } = content;

    return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; background-color: #FDE8EE;">
    <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #FDE8EE; padding: 20px 0;">
        <tr>
            <td align="center" style="padding: 20px 0;">
                <table role="presentation" style="width: 100%; max-width: 600px; background-color: #ffffff; border-radius: 20px; box-shadow: 0 6px 18px rgba(20, 20, 30, 0.1); overflow: hidden;">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #FDE8EE 0%, #FFF7E6 100%); padding: 40px 30px; text-align: center;">
                            <h1 style="margin: 0; font-family: Georgia, serif; font-size: 28px; font-weight: 700; color: #2b2b2b;">
                                Cute Mark
                            </h1>
                        </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <h2 style="margin: 0 0 20px 0; font-family: Georgia, serif; font-size: 24px; font-weight: 700; color: #2b2b2b;">
                                ${title}
                            </h2>
                            <div style="font-size: 16px; line-height: 1.6; color: #4b5563; margin-bottom: 30px;">
                                ${message}
                            </div>

                            ${buttonText && buttonLink ? `
                            <table role="presentation" style="width: 100%; margin: 30px 0;">
                                <tr>
                                    <td align="center">
                                        <a href="${buttonLink}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(90deg, rgba(253, 232, 238, 0.95), rgba(243, 232, 255, 0.95)); color: #2b2b2b; text-decoration: none; border-radius: 14px; font-weight: 700; font-size: 16px; box-shadow: 0 6px 18px rgba(20, 20, 30, 0.08);">
                                            ${buttonText}
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            ` : ''}
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #FDE8EE;">
                            ${footerText ? `
                            <p style="margin: 0 0 10px 0; font-size: 14px; color: #6b7280; line-height: 1.6;">
                                ${footerText}
                            </p>
                            ` : ''}
                            <p style="margin: 0; font-size: 12px; color: #9ca3af;">
                                © ${new Date().getFullYear()} Cute Mark. Todos los derechos reservados.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `.trim();
}

/**
 * Template para confirmación de pedido
 */
export function generateOrderConfirmationTemplate(orderData: {
    orderNumber: string;
    customerName: string;
    items: Array<{ name: string; quantity: number; price: number }>;
    total: number;
}): string {
    const itemsHtml = orderData.items
        .map(
            (item) => `
            <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #FDE8EE;">
                    <div style="font-weight: 600; color: #2b2b2b; margin-bottom: 4px;">${item.name}</div>
                    <div style="font-size: 14px; color: #6b7280;">Cantidad: ${item.quantity}</div>
                </td>
                <td align="right" style="padding: 12px 0; border-bottom: 1px solid #FDE8EE; font-weight: 700; color: #2b2b2b;">
                    $${item.price.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
            </tr>
        `
        )
        .join('');

    return generateEmailTemplate({
        title: '¡Pedido Confirmado!',
        message: `
            <p style="margin: 0 0 20px 0;">Hola <strong>${orderData.customerName}</strong>,</p>
            <p style="margin: 0 0 20px 0;">Gracias por tu compra. Tu pedido ha sido confirmado.</p>
            <p style="margin: 0 0 20px 0;"><strong>Número de pedido:</strong> ${orderData.orderNumber}</p>

            <table role="presentation" style="width: 100%; margin: 30px 0; border-collapse: collapse;">
                <tr>
                    <th align="left" style="padding: 12px 0; border-bottom: 2px solid #FDE8EE; font-weight: 700; color: #2b2b2b;">Producto</th>
                    <th align="right" style="padding: 12px 0; border-bottom: 2px solid #FDE8EE; font-weight: 700; color: #2b2b2b;">Total</th>
                </tr>
                ${itemsHtml}
                <tr>
                    <td style="padding: 20px 0 0 0; font-weight: 700; font-size: 18px; color: #2b2b2b;">Total</td>
                    <td align="right" style="padding: 20px 0 0 0; font-weight: 700; font-size: 18px; color: #2b2b2b;">
                        $${orderData.total.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                </tr>
            </table>
        `,
        footerText: 'Te notificaremos cuando tu pedido sea enviado.',
    });
}

/**
 * Template para notificación de contacto
 */
export function generateContactTemplate(contactData: {
    name: string;
    email: string;
    message: string;
}): string {
    return generateEmailTemplate({
        title: 'Nuevo Mensaje de Contacto',
        message: `
            <p style="margin: 0 0 15px 0;"><strong>Nombre:</strong> ${contactData.name}</p>
            <p style="margin: 0 0 15px 0;"><strong>Email:</strong> ${contactData.email}</p>
            <p style="margin: 0 0 15px 0;"><strong>Mensaje:</strong></p>
            <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; border-left: 4px solid #FDE8EE; margin-top: 10px;">
                ${contactData.message.replace(/\n/g, '<br>')}
            </div>
        `,
    });
}

