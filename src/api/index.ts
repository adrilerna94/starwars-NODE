// 🎯 Orden correcto de los middlewares en Express:

/*
  1️⃣ Primero, procesamos los datos de la solicitud (por ejemplo, usando express.json()).
  ✅ Este middleware procesa el cuerpo de la solicitud (si es JSON).

  2️⃣ Luego, definimos las rutas donde se maneja la lógica principal de la aplicación.
  🛣️ Aquí es donde manejamos las rutas y se ejecuta la lógica para responder a la solicitud.

  3️⃣ Finalmente, manejamos los errores con el middleware de error (errorMiddleware).
  ⚠️ Si algo falla en el proceso de la solicitud, este middleware captura los errores y responde adecuadamente.
*/

import { Router } from 'express';
import express from 'express';
import { starWarsRouter } from './routers/starWarsRouter';
import errorMiddleware from './middlewares/errorMiddleware';

const apiRouter = Router();

// 1️⃣ Procesamos el cuerpo de la solicitud
apiRouter.use(express.json());

// 2️⃣ Definimos las rutas
apiRouter.use('/people', starWarsRouter);  // Ruta principal de la API

// 3️⃣ Manejo de errores
apiRouter.use(errorMiddleware);

export default apiRouter;
