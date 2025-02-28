import dotenv from "dotenv";
dotenv.config();

export interface GenerarCorreoParams {
  User: string; // El correo del usuario
  codigo: string;
}
export const HTML = async ({
  User,
  codigo,
}: GenerarCorreoParams): Promise<string> => {
  return `
      <div class="">
        <div class="aHl"></div>
        <div id=":pf" tabindex="-1"></div>
        <div id=":p5" class="ii gt" jslog="20277; u014N:xr6bB;">
          <div id=":pn" class="a3s aiL">
            <table border="0" cellspacing="0" cellpadding="0" style="max-width:600px">
              <tbody>
                <tr>
                  <td>
                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                      <tbody>
                        <tr>
                          <td align="center">
                         <img width="auto" height="32" src="https://res.cloudinary.com/doza0twgj/image/upload/v1734039010/LOGO_APE_color_gjlabc.png" style="display:block;width:92px;height:32px" class="CToWUd" data-bit="iit">
                       </td>
                         
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
                <tr height="16"></tr>
                <tr>
                  <td>
                    <table bgcolor="#39A900" width="100%" border="0" cellspacing="0" cellpadding="0" style="min-width:332px;max-width:600px;border:1px solid #e0e0e0;border-bottom:0;border-top-left-radius:3px;border-top-right-radius:3px">
                      <tbody>
                        <tr><td height="72px" colspan="3"></td></tr>
                        <tr><td width="32px"></td><td style="font-family:Roboto-Regular,Helvetica,Arial,sans-serif;font-size:24px;color:#ffffff;line-height:1.25">Código de verificación de Digiturno</td><td width="32px"></td></tr>
                        <tr><td height="18px" colspan="3"></td></tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td>
                    <table bgcolor="#FAFAFA" width="100%" border="0" cellspacing="0" cellpadding="0" style="min-width:332px;max-width:600px;border:1px solid #f0f0f0;border-bottom:1px solid #c0c0c0;border-top:0;border-bottom-left-radius:3px;border-bottom-right-radius:3px">
                      <tbody>
                        <tr height="16px">
                          <td width="32px" rowspan="3"></td>
                          <td></td>
                          <td width="32px" rowspan="3"></td>
                        </tr>
                        <tr>
                          <td>
                            <p>Hola, ${User}.</p>
                            <p>Recibimos una solicitud para acceder a tu cuenta de Digiturno <span style="color:#659cef" dir="ltr"><a href="mailto:${User}" target="_blank">${User}</a></span> con tu dirección de correo electrónico. El código de verificación de Digiturno es:</p>
                            <div style="text-align:center">
                              <p dir="ltr"><strong style="text-align:center;font-size:24px;font-weight:bold">${codigo}</strong></p>
                            </div>
                            <p>Si no solicitaste este código, es posible que otra persona esté intentando acceder a la cuenta de Digiturno <span style="color:#659cef" dir="ltr"><a href="mailto:${User}" target="_blank">${User}</a></span>. <strong>No reenvíes ni proporciones este código a otra persona.</strong></p>
                            <p>Recibiste este mensaje porque este es el correo de recuperación registrado para la cuenta de Digiturno <span style="color:#659cef"><a href="mailto:${User}" target="_blank">${User}</a></span>
                            <p>Atentamente.</p>
                            <p>El equipo de Digiturno</p>
                          </td>
                        </tr>
                        <tr height="32px"></tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
                <tr height="16"></tr>
                <tr>
                  <td style="max-width:600px;font-family:Roboto-Regular,Helvetica,Arial,sans-serif;font-size:10px;color:#bcbcbc;line-height:1.5">
                    <table>
                      <tbody>
                        <tr>
                          <td>
                            <table style="font-family:Roboto-Regular,Helvetica,Arial,sans-serif;font-size:10px;color:#666666;line-height:18px;padding-bottom:10px">
                              
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
};

export const HTMLCalificacion = async ({
  User,
}: GenerarCorreoParams): Promise<string> => {
  return `
   <div class="">
     <div class="aHl"></div>
     <div id=":pf" tabindex="-1"></div>
     <div id=":p5" class="ii gt" jslog="20277; u014N:xr6bB;">
       <div id=":pn" class="a3s aiL">
               <table border="0" cellspacing="0" cellpadding="0" style="max-width:850px; height: auto">
           <tbody>
             <tr>
               <td>
                 <table width="100%" border="0" cellspacing="0" cellpadding="0">
                   <tbody>
                     <tr>
                       <td align="center">
                       <img
                  src="https://res.cloudinary.com/doza0twgj/image/upload/v1734039010/LOGO_APE_color_gjlabc.png"
                  alt="Logo"
                  width="52"
                  height="auto"
                 style="display:block;width:300px;height:auto;"
                />
                       </td>
                      
                     </tr>
                   </tbody>
                 </table>
               </td>
             </tr>
             <tr height="16"></tr>
             <tr>
               <td>
                 <table bgcolor="#39A900" width="100%" border="0" cellspacing="0" cellpadding="0" style="min-width:332px;max-width:600px;border:1px solid #e0e0e0;border-bottom:0;border-top-left-radius:3px;border-top-right-radius:3px">
                   <tbody>
                     <tr><td height="72px" colspan="3"></td></tr>
                     <tr><td width="32px"></td><td style="font-family:Roboto-Regular,Helvetica,Arial,sans-serif;font-size:24px;color:#ffffff;line-height:1.25">¡Califica nuestro servicio!</td><td width="32px"></td></tr>
                     <tr><td height="18px" colspan="3"></td></tr>
                   </tbody>
                 </table>
               </td>
             </tr>
             <tr>
               <td>
                 <table bgcolor="#FAFAFA" width="100%" border="0" cellspacing="0" cellpadding="0" style="min-width:332px;max-width:600px;border:1px solid #f0f0f0;border-bottom:1px solid #c0c0c0;border-top:0;border-bottom-left-radius:3px;border-bottom-right-radius:3px">
                   <tbody>
                     <tr height="16px">
                       <td width="32px" rowspan="3"></td>
                       <td></td>
                       <td width="32px" rowspan="3"></td>
                     </tr>
                     <tr>
                       <td>
                         <p>Hola, ${User}.</p>
                         <p>Gracias por usar los servicios que la agencia pública de empleo ofrece
                         </p>
                         <p>Por favor, califica nuestro servicio:</p>
                          <div style="text-align:center;">
 <center>
                             
                                <img src="cid:qrImage" alt="Código QR" style="width: 100px; height: auto;" />
                             </center>
</div>
                         <p>Si no usaste los servicios de la APE e igualmente recibió el correo a su dirección de correo <span style="color:#659cef" dir="ltr"><a href="mailto:${User}" target="_blank">${User}</a></span>, haga caso omiso a este correo. <strong>No reenvíes este correo a ninguna otra persona.</strong></p>
                         
                         <p>Atentamente.</p>
                         <p>El equipo de Digiturno</p>
                       </td>
                     </tr>
                     <tr height="32px"></tr>
                   </tbody>
                 </table>
               </td>
             </tr>
             <tr height="16"></tr>
             <tr>
               <td style="max-width:600px;font-family:Roboto-Regular,Helvetica,Arial,sans-serif;font-size:10px;color:#bcbcbc;line-height:1.5">
                 <table>
                   <tbody>
                     <tr>
                       <td>
                         <table style="font-family:Roboto-Regular,Helvetica,Arial,sans-serif;font-size:10px;color:#666666;line-height:18px;padding-bottom:10px">
                           
                         </table>
                       </td>
                     </tr>
                   </tbody>
                 </table>
               </td>
             </tr>
           </tbody>
         </table>
       </div>
     </div>
   </div>
 `;
};

export const HTMLSeguimiento = async ({
  User,
  codigo,
}: any): Promise<string> => {
  return `
      <div class="">
        <div class="aHl"></div>
        <div id=":pf" tabindex="-1"></div>
        <div id=":p5" class="ii gt" jslog="20277; u014N:xr6bB;">
          <div id=":pn" class="a3s aiL">
              <table border="0" cellspacing="0" cellpadding="0" style="max-width:600px;width:100%;margin:0 auto;">
  <tbody>
    <tr>
      <td>
        <table width="100%" border="0" cellspacing="0" cellpadding="0">
          <tbody>
            <tr>
              <td align="center">
                     <img
                  src="https://res.cloudinary.com/doza0twgj/image/upload/v1734039010/LOGO_APE_color_gjlabc.png"
                  alt="Logo"
                  width="52"
                  height="auto"
                  style="display:block;width:300px;height:auto;"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
    <tr>
      <td>
        <table
          bgcolor="#39A900"
          border="0"
          cellspacing="0"
          cellpadding="0"
          style="
            width:100%;
            max-width:600px;
            border:1px solid #e0e0e0;
            border-bottom:0;
            border-radius:3px 3px 0 0;
          "
        >
          <tbody>
            <tr>
              <td colspan="3" style="height:72px;"></td>
            </tr>
            <tr>
              <td style="width:32px;"></td>
              <td
                style="
                  font-family:Roboto, Arial, sans-serif;
                  font-size:24px;
                  color:#ffffff;
                  text-align:center;
                "
              >
                ¡Hazle seguimiento a tu turno!
              </td>
              <td style="width:32px;"></td>
            </tr>
            <tr>
              <td colspan="3" style="height:18px;"></td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
    <tr>
      <td>
        <table
          bgcolor="#FAFAFA"
          border="0"
          cellspacing="0"
          cellpadding="0"
          style="
            width:100%;
            max-width:600px;
            border:1px solid #f0f0f0;
            border-top:0;
            border-radius:0 0 3px 3px;
          "
        >
          <tbody>
            <tr>
              <td style="width:32px;"></td>
              <td>
                <p style="font-family:Roboto, Arial, sans-serif;">Hola, ${User}.</p>
                <p style="font-family:Roboto, Arial, sans-serif;">
                  Gracias por usar los servicios que la Agencia Pública de Empleo ofrece.
                </p>
                <p style="font-family:Roboto, Arial, sans-serif;">
                  Te invitamos a ver el seguimiento de tu turno:
                </p>
                <div style="text-align:center;">
                  <img
                    src="cid:qrImage"
                    alt="Código QR"
                    style="width:100px;height:auto;"
                  />
                </div>
                <p style="font-family:Roboto, Arial, sans-serif;">
                  Si no usaste los servicios de la APE y aún así recibiste este correo en tu dirección
                  <a
                    href="mailto:${User}"
                    target="_blank"
                    style="color:#659cef;"
                    >${User}</a
                  >, haz caso omiso a este correo. <strong>No reenvíes este correo a ninguna otra persona.</strong>
                </p>
                <p style="font-family:Roboto, Arial, sans-serif;">Atentamente,</p>
                <p style="font-family:Roboto, Arial, sans-serif;">El equipo de Digiturno</p>
              </td>
              <td style="width:32px;"></td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
    <tr>
      <td style="font-family:Roboto, Arial, sans-serif;font-size:10px;color:#bcbcbc;text-align:center;">
        Si tienes problemas para visualizar este correo, contáctanos.
      </td>
    </tr>
  </tbody>
</table>
          </div>
        </div>
      </div>
    `;
};
