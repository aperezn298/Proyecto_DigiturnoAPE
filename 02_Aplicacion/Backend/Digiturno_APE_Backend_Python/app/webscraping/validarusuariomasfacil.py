import requests
from bs4 import BeautifulSoup

import requests
from bs4 import BeautifulSoup

def verificar_usuario_facil(numero_documento, email, servicio_id: int) -> bool:
    if servicio_id == 1:
        return True
    
    session = requests.Session()
    
    # URL inicial donde se encuentran los términos y condiciones
    url_tyc = "https://agenciapublicadeempleo.sena.edu.co/spe-web/spe/registro/buscador#"
    response = session.get(url_tyc)
    
    if response.status_code != 200:
        raise Exception("Error al cargar la página de términos y condiciones.")
    
    # Analizar el HTML de la página
    soup = BeautifulSoup(response.text, 'html.parser')
    aceptar_btn = soup.find('a', {'id': 'btnAceptoB'})
    
    if not aceptar_btn:
        raise Exception("No se encontró el botón para aceptar términos y condiciones.")
    
    aceptar_url = aceptar_btn.get('href')
    
    if not aceptar_url or aceptar_url == "#":
        raise Exception("La URL del botón no es válida.")
    
    # Si la URL es relativa, combínala con la URL base
    if aceptar_url.startswith('/'):
        base_url = "https://agenciapublicadeempleo.sena.edu.co"
        aceptar_url = base_url + aceptar_url
    
    # Simular clic en "Aceptar términos y condiciones"
    session.get(aceptar_url)
    
    # URL del formulario
    url_formulario = "https://agenciapublicadeempleo.sena.edu.co/spe-web/spe/registro/buscador"
    
    # Datos a enviar en el formulario
    data = {
        "tipoDocumento": "1",  # Cédula de ciudadanía
        "numeroDocumento": numero_documento,
        "email": email,
    }
    
    # Enviar el formulario
    response = session.post(url_formulario, data=data)
    
    if response.status_code != 200:
        raise Exception("Error al enviar el formulario.")
    
    # Verificar si hay errores
    if "numeroDocumento.errors" in response.text:
        return False  # Usuario ya existe
    return True  # Usuario creado correctamente


# Ejemplo de uso
# numero_documento = "1234567890"
# email = "usuario@correo.com"
# servicio_id = 2

# resultado = verificar_usuario_facil(numero_documento, email, servicio_id)
# print("Resultado:", resultado)
