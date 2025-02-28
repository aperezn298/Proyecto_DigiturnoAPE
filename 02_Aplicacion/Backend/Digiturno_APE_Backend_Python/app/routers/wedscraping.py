from fastapi import  APIRouter, HTTPException, Query, status

from app.webscraping.validarusuariomasfacil import verificar_usuario_facil
from app.webscraping.validarusuario import verificar_usuario

router = APIRouter(tags=['webscraping'])  # Define el router con las etiquetas predeterminadas

@router.post("/webscrapingfacil", )
async def crear_customer(numero_documento: str, email: str, servicio_id: int):
    try:
        resultado = verificar_usuario_facil(numero_documento, email, servicio_id)
        return resultado
    except HTTPException as e:
        raise e
    except Exception as e:
        # Manejar otros errores inesperados
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/webscraping")
async def crear_customer(numero_documento: str, email: str, servicio_id: int):
    try:
        resultado = verificar_usuario(numero_documento, email, servicio_id)
        return resultado
    except HTTPException as e:
        raise e
    except Exception as e:
        # Manejar otros errores inesperados
        raise HTTPException(status_code=500, detail=str(e))