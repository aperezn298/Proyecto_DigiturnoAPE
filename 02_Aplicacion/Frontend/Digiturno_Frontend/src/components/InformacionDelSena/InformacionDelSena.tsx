import { Image } from "@nextui-org/react"
import imagen from "../../assets/agenciapublica.png"
import { Facebook, Twitter, Youtube, Linkedin } from 'lucide-react'
export const InFormacionDelSena = () => {
	return <>

		<div className="gov-co-footer-autoridad rounded-lg text-sm md:text-xs">
			<div className="footer-titulo ">
				<div className="container-fluid">
					<div className="row">
						<div className="col">
							<h5 className="titulo-sede-gov-co"
								style={{
									margin: "10px"
								}}>Servicio Nacional de Aprendizaje SENA</h5>
						</div>
					</div>
				</div>
			</div>


			<div
				className="flex"
				style={{
					margin: "10px"
				}}
			>


				<div className="footer-presentacion w-100">
					<div className="container-fluid">
						<div className="row">
							<div className="col">
								<h5 className="sub-titulo-sede-gov-co">Dirección General</h5>
							</div>
						</div>
						<div className="row">
							<div className="col">
								<div className="sm:text-sm  text-sm">
									<p>Dirección: Calle 57 No. 8 - 69 Bogotá D.C. (Cundinamarca), Colombia</p>
									<p>Línea de atención al la ciudadanía: Bogotá (+57)601 3430111 - Línea gratuita y resto del país 018000 910270</p>
									<p>Línea de atención al empresario: Bogotá (+57) 601 3430101 - Línea gratuita y resto del país 018000 910682</p>
									<p>Línea nacional, exclusiva para comunicarse con un servidor público SENA: (+57) 601 5461500</p>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="  w-64"
				>
					<div className="containder-fluid">
						<div className="row">
							<div className="col footer-logo-col">
								<div className="footer-logo-container"><Image className="footer-logo" src="https://res.cloudinary.com/doza0twgj/image/upload/v1734039010/LOGO_APE_color_gjlabc.png " /></div>
								<div className="footer-logo-container "><Image src="https://www.sena.edu.co/Style%20Library/alayout/images/Icontec03_all.png" className="w-60" /></div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="footer-politicas w-100 "
				style={{

					marginTop: "-60px"
				}}
			>
				<div className="">
					<div className="row p-0">
						<div className="col">
							<div className="gov-co-redes-sociales flex">
								<a className="gov-co-link-presentacion mr-2" href="https://www.facebook.com/SENA/" id="Facebook" target="_blank" title="Facebook" data-toggle="tooltip" data-placement="bottom" data-img="/Imagenes%20Seas/Default.gif" data-content="<img src='null' alt=''> " data-original-title="Facebook">
									<i className="fab fa-facebook">

									</i>
									@SENA
								</a>
								<a className="gov-co-link-presentacion mr-2" aria-label="Síguenos en Twitter" rel="nofollow noopener noreferrer" target="_blank" href="https://twitter.com/SENAComunica" title="al hacer click viajará a twitter">
									<i className="fab fa-twitter"></i>
									@SENACOMUNICA
								</a>
								<a className="gov-co-link-presentacion mr-2" aria-label="Síguenos en Instagram" rel="nofollow noopener noreferrer" target="_blank" href="https://www.instagram.com/senacomunica/" title="al hacer click viajará a Instagram">
									<i className="fab fa-instagram"></i>
									@SENACOMUNICA
								</a>
								<a className="gov-co-link-presentacion mr-2" aria-label="Síguenos en Youtube" rel="nofollow noopener noreferrer" target="_blank" href="https://www.youtube.com/user/SENATV" title="al hacer click viajará a youtube">
									<i className="fab fa-youtube"></i>
									@SENATV
								</a>
								<a className="gov-co-link-presentacion mr-2" rel="nofollow noopener noreferrer" id="LinkedIn" href="https://www.linkedin.com/company/agencia-p%C3%BAblica-de-empleo-sena" target="_blank" title="LinkedIn" data-toggle="tooltip" data-placement="bottom" data-original-title="LinkedIn" data-content="<img src='null' alt=''> ">
									<i className="fab fa-linkedin-in"></i>
									@SENA
								</a>
								<a className="gov-co-link-presentacion" aria-label="Síguenos en Soundcloud" rel="nofollow noopener noreferrer" target="_blank" href="https://soundcloud.com/senacolombia/" title="al hacer click viajará a SoundCloud">
									<i className="fab fa-soundcloud"></i>
									@senacolombia
								</a>
							</div>
						</div>
					</div>
					<div className="row p-0">
						<div className="col p-0">
							<div className="gov-co-politicas text-sm ">
								<a className="goc-co-link-poli sm:text-xs  text-sm" id="Directorio" href="https://ape.sena.edu.co/Paginas/DirectorioAPE.aspx" target="_blank" data-toggle="tooltip" data-placement="bottom" data-original-title="Directorio APE" title="">Directorio APE</a>

								<a className="goc-co-link-poli sm:text-xs text-sm" id="PQRS" href="http://sciudadanos.sena.edu.co/SolicitudIndex.aspx" target="_blank" data-toggle="tooltip" data-placement="bottom" data-original-title="PQRS" title="">PQRS</a>

								<a className="goc-co-link-poli sm:text-xs text-sm" id="CHAT" href="http://www.sena.edu.co/es-co/ciudadano/Paginas/chat.aspx" target="_blank" data-toggle="tooltip" data-placement="bottom" data-original-title="Chat en línea" title="">Chat en línea</a>

								<a className="goc-co-link-poli sm:text-xs text-sm" id="DenunciasCorrupcion" href="https://www.sena.edu.co/es-co/ciudadano/Paginas/Denuncias_Corrupcion.aspx" target="_blank" data-toggle="tooltip" data-placement="bottom" data-original-title="Denuncias por actos de corrupción" title="">Denuncias por actos de corrupción</a>

								<a className="goc-co-link-poli sm:text-xs text-sm" id="TerminosUso" href="https://ape.sena.edu.co/Paginas/T%C3%A9rminos-y-condiciones-de-uso-del-portal-web-de-la-Agencia-P%C3%BAblica-de-Empleo-del-SENA.aspx" style={{ display: "inline-block" }} target="_blank" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="Derechos de autor y/o autorización de uso sobre los contenidos - Términos y condiciones del portal web">Derechos de autor y/o autorización de uso sobre los contenidos - Términos y condiciones del portal web</a>

								<a className="goc-co-link-poli sm:text-xs text-sm" id="PoliticaDatos" href="https://compromiso.sena.edu.co/mapa/descarga.php?id=4019" title="" target="_blank" data-toggle="tooltip" data-placement="bottom" data-original-title="Política de tratamiento para protección de datos personales">Política de tratamiento para protección de datos personales</a>

								<a className="goc-co-link-poli sm:text-xs text-sm" id="PoliticaSeguridadPrivacidadInformacion" href="https://compromiso.sena.edu.co/mapa/descarga.php?id=5072" target="_blank" data-toggle="tooltip" data-placement="bottom" data-original-title="Politucas de seguridad" title="Politicas de seguridad" data-content="<img src='null' alt=''> ">Política de seguridad y privacidad de la información</a>

								<a className="goc-co-link-poli sm:text-xs text-sm" id="NotificacionesJudiciales" href="https://www.sena.edu.co/es-co/transparencia/Paginas/mecanismosContacto.aspx#notificacionesJudiciales" target="_blank" data-toggle="tooltip" data-placement="bottom" data-original-title="Notificaciones judiciales" title="">Notificaciones judiciales</a>

								<a className="goc-co-link-poli sm:text-xs text-sm" id="ServicioCiudadano" href="mailto:servicioalciudadano@sena.edu.co" target="_blank" data-toggle="tooltip" data-placement="bottom" data-original-title="Correo servicio al ciudadano" title="">servicioalciudadano@sena.edu.co</a>

								<a className="goc-co-link-poli sm:text-xs text-sm" id="MapaSitio" href="https://ape.sena.edu.co/Paginas/MapaDelSitio.aspx" target="_blank" data-toggle="tooltip" data-placement="bottom" data-original-title="Mapa del sitio" title="">Mapa del sitio</a>
							</div>
						</div>
					</div>
					<div className="row">
						<div className="col">
							<p id="contadorVisitas" className="gov-detalles"></p>
							<div className="last-edit gov-detalles d-flex">
								<p id="footerTexto14" className="mr-2">Última modificación:</p>
								<p>15/12/2020 3:45 p. m.</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</>
}