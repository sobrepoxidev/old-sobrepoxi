'use server';
import { sendMail } from "@/lib/email";
import { Database } from '@/types-db';
type CartItem = Database['user_tickets'];

// interface CartItem {
//   id: number;
//   premio: string;
//   min_number?: number;
//   max_number?: number;
//   min_serie?: number;
//   max_serie?: number;
//   number?: number | null;
//   serie?: number | null;
//   date?: string;
//   time?: string;
//   costo: number;
//   image_url?: string;
// }

export const sendCartEmail = async (cartData: CartItem[], correo: string | undefined, nombreUsuario: string | undefined) => {
  // Validar datos
  if (!cartData || cartData.length === 0) {
    throw new Error('El carrito está vacío');
  }

  // Determinar si es singular o plural
  const cardsTerm = cartData.length > 1 ? 'tus PoxiCards' : 'tu PoxiCard';
  const total = cartData.reduce((acc, item) => acc + item.costo, 0);

  
 

  // Construir contenido del correo
  const htmlContent = `
    <div style="max-width: 600px; margin: auto; font-family: Arial, sans-serif;">
      <header style="text-align: center; padding: 20px; background-color: #f8f9fa;">
        <div class="header" style="background: transparent; text-align: center; margin-bottom: 20px;">
  <img src="https://drive.google.com/uc?export=view&id=1dWPIIrd0-2sTiHBquWMzu464zv27T4l9" 
       alt="Sobrepoxi" 
       class="logo" 
       style="width: 120px; height: auto; border-radius: 50%; display: block; margin: 0 auto;">
</div>

        <h1 style="color: #2b2d42; margin-top: 10px;">¡Gracias por tu compra!</h1>
      </header>

      <div style="padding: 20px;">
        <p>Estimado ${nombreUsuario},</p>
        <p>Aquí tienes el detalle de ${cardsTerm}:</p>

        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <thead style="background-color: #4a4e69; color: white;">
            <tr>
              <th style="padding: 12px; text-align: left;">Premio</th>
              <th style="padding: 12px; text-align: left;">Números</th>
              <th style="padding: 12px; text-align: left;">Serie</th>
              <th style="padding: 12px; text-align: left;">Fecha</th>
              <th style="padding: 12px; text-align: right;">Costo</th>
            </tr>
          </thead>
          <tbody>
            ${cartData.map(item => `
              <tr style="border-bottom: 1px solid #ddd;">
                <td style="padding: 12px;">${item.premio}</td>
                <td style="padding: 12px;">${item.number}</td>
                <td style="padding: 12px;">${item.serie}</td>
                <td style="padding: 12px;">${item.date || 'N/A'} ${item.time ? `• ${item.time.slice(0, 5)}` : ''}</td>
                <td style="padding: 12px; text-align: right;">₡${item.costo.toLocaleString('es-CR')}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div style="text-align: right; font-size: 1.1em; margin-top: 20px;">
          <strong>Total:</strong> ₡${total.toLocaleString('es-CR')}
        </div>

        <div style="margin-top: 30px; padding: 20px; background-color: #f8f9fa; border-radius: 8px;">
          <h3 style="color: #2b2d42; margin-bottom: 15px;">¡Importante!</h3>
          <p>Todos ${cardsTerm} estarán disponibles en:</p>
          <ul style="list-style-type: circle; margin-left: 20px;">
            <li>Web Sobrepoxi (Sección "PoxiCards")</li>
          </ul>
        </div>
      </div>

      <footer style="text-align: center; padding: 20px; background-color: #2b2d42; color: white;">
        <p>© ${new Date().getFullYear()} Sobrepoxi • Todos los derechos reservados</p>
        <p style="margin-top: 10px;">Contacto: info@sobrepoxi.com • Tel: (+506) 8585-0000</p>
      </footer>
    </div>
  `;

  try {
    // Enviar correo
    await sendMail(correo, `Recibo de ${cardsTerm} - Sobrepoxi`, htmlContent);
    return { success: true };
  } catch (error) {
    console.error('Error enviando correo:', error);
    throw new Error('Error al enviar el correo de confirmación');
  }
};
