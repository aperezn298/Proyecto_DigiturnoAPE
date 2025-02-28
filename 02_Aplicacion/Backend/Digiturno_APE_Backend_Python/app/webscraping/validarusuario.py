from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import Select
from selenium.common.exceptions import TimeoutException, WebDriverException
from webdriver_manager.microsoft import EdgeChromiumDriverManager  
from selenium.webdriver.edge.service import Service as EdgeService
from webdriver_manager.firefox import GeckoDriverManager
from selenium.webdriver.firefox.service import Service as FirefoxService
import traceback
import time
from selenium.webdriver.chrome.service import Service


def verificar_usuario(numero_documento: str, email: str, servicio_id: int) -> bool:
    # Si el servicioId es 1, devolver True directamente
    if servicio_id == 1:
        return True

    driver = None
    try:
        # Configuración del navegador (asegúrate de tener ChromeDriver instalado)
        service = Service('../../chromedriver-win64/chromedriver.exe')
        options = webdriver.ChromeOptions()
        options.add_argument("--headless")  # Ejecutar en modo headless
        options.add_argument("--no-sandbox")
        options.add_argument("--disable-dev-shm-usage")
        options.binary_location = "../../chromedriver-win64/ChromeSetup.exe"  # Ruta al ejecutable de Chrome
        # Inicializar el driver
        driver = webdriver.Chrome(service=service, options=options)
        wait = WebDriverWait(driver, 20)

        # Navegar al sitio web
        driver.get("https://agenciapublicadeempleo.sena.edu.co/spe-web/spe/registro/buscador#")

        # Aceptar términos y condiciones
        accept_button = wait.until(EC.element_to_be_clickable((By.ID, "btnAceptoB")))
        accept_button.click()

        # Esperar a que el formulario esté presente
        wait.until(EC.presence_of_element_located((By.ID, "_tipoDocumento")))

        # Llenar el formulario
        tipo_documento = Select(driver.find_element(By.ID, "_tipoDocumento"))
        tipo_documento.select_by_value("1")  # Cédula de Ciudadanía

        numero_documento_input = driver.find_element(By.ID, "_numeroDocumento")
        numero_documento_input.send_keys(numero_documento)

        email_input = driver.find_element(By.ID, "_email")
        email_input.send_keys(email)

        # Enviar el formulario
        submit_button = driver.find_element(By.CSS_SELECTOR, "button.btn-success")
        submit_button.click()

        # Esperar la respuesta de la página
        time.sleep(2)  # Ajusta esto si necesitas más tiempo

        # Verificar si existe un error
        try:
            error_element = wait.until(EC.presence_of_element_located((By.ID, "numeroDocumento.errors")))
            return False  # Retorna False si existe un error
        except TimeoutException:
            return True  # Retorna True si no hay error

    except Exception as e:
        print("Error durante la verificación:", e)
        return False
    finally:
        if driver:
            driver.quit()


# resultado = verificar_usuario("1234567890", "usuario@correo.com", 2)
# print("Resultado:", resultado)
