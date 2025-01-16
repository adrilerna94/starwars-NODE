import { Request, Response } from "express";
import axios from "axios";
import { StarWars } from "../interfaces/starwars.interface";
import { StarWarsPagination } from "../interfaces/starwarsPagination.interface";

const url = "https://www.swapi.tech/api/people/";
const EXPIRATION_TIME = 300_000; // 5 minutos

/*
  📌 ¿Por qué ahora funciona? ➡️ **as string** 📌
  - ➡️ `as string` le indica a TypeScript que trate `page` y `limit` como **cadenas de texto**.
  - ➡️ Forzar el tipo: Cambia el tipo de `page` y `limit` de tipos más amplios (`string[]`, `undefined`) a **`string`**.
  - ➡️ Eliminación de errores de tipo: Después de la conversión explícita, **TypeScript ya no lanza errores** al usar `page` y `limit` en funciones como `savePaginationInCache`.

  🔍 ➡️ **Puntos importantes** 🔍
  - ➡️ Si `page` o `limit` son **`undefined`**, el código podría seguir funcionando incorrectamente.
  - ➡️ Asegúrate de **asignar un valor predeterminado** si `page` o `limit` son `undefined`, para evitar pasar valores no válidos.

  🛠️ ➡️ **Solución sugerida**:
  - ➡️ Asigna un valor predeterminado a `page` y `limit` si son `undefined`:
    ```typescript
    const page = req.query.page ? (req.query.page as string) : '1'; // Default to '1' if undefined
    const limit = req.query.limit ? (req.query.limit as string) : '10'; // Default to '10' if undefined
    ```

  ✔️ ➡️ **Resultado**: Ahora el código funciona correctamente sin errores de tipo y con valores predeterminados si es necesario.
*/


// Controlador para la ruta /people con paginación
export const getPeopleWithPagination = async (req: Request, res: Response) => {
  const { page, limit } = req.query;
  const paginationKey = `page-${page}-limit-${limit}`;

  // Verificamos si los datos están en caché y son válidos
  if (cacheExists(paginationKey)) {
    if (!isCacheValid(paginationKey)) {
      delete global.cache[paginationKey];
    } else {
      return res.json(global.cache[paginationKey].data);
    }
  }

  try {
    const response = await axios.get(url, {
      params: { page, limit },
    });

    const timestamp = new Date().getTime();

    // Almacenamos los datos en caché
    savePaginationInCache(page as string, limit as string, response.data, timestamp);

    return res.json(response.data);
  } catch (error) {
    return res.status(500).json({ error: "Error fetching data from API" });
  }
};

// Controlador para la ruta /people/:uid
export const getPeopleByNumber = async (req: Request, res: Response) => {
  const uid = req.params.uid;
  const force = req.query.force === 'true';

  // verificamos si la info está en caché y es válida
  const cachedData = await getCachedData(uid, force);

  if (!cachedData) {
    return res.status(404).json({
      status: 'Fail',
      msn: `Star Wars character with ID ${uid} NOT FOUND`,
    });
  }

  // Respondemos con los datos del personaje
  return res.status(200).json({
    status: 'Success',
    character: cachedData.result.properties.name,
    data: cachedData,
  });
};

// Función para verificar y obtener datos de la caché o hacer una nueva solicitud
async function getCachedData(uid: string, force: boolean) {

  // Si la caché no existe, ha expirado o se requiere forzar una actualización (force)
  if (!cacheExists(uid) || !isCacheValid(uid) || force) {
    // Si la caché no es válida o se requiere una actualización forzada, eliminamos la caché expirado
    if (cacheExists(uid) && !isCacheValid(uid)) {
      delete global.cache[uid]; // Limpiar caché expirado
    }
    // Hacemos una solicitud a la API para obtener los datos actualizados
    return await fetchPeopleFromApi(uid);
  }

  // Si la caché es válida, retornamos los datos
  return global.cache[uid].data;
}


// Función para obtener los datos de la API
async function fetchPeopleFromApi(uid: string) {
  try {
    const response = await axios.get(`${url}${uid}`); // esperamos a que la solicitud se complete
    const data = response.data;

    // Verificamos si la respuesta contiene el campo `result` y luego `properties`
    if (!data || !data.result || !data.result.properties) {
      console.log('Data not found');
      return null; // Si no se encuentra el personaje, retornamos null
    }

    // Guardamos los datos en caché con la expiración fija
    const timestamp = new Date().getTime();
    savePeopleInCache(uid, data, timestamp);

    return data;
  } catch (error) {
    console.error('Error fetching data from API:', error);
    return null; // Si hay un error al hacer la solicitud, retornamos null
  }
}

// Función para guardar los datos de paginación en caché
const savePaginationInCache = (page: string, limit: string, data: StarWarsPagination, timestamp: number) => {
  const paginationKey = `page-${page}-limit-${limit}`;

  // Actualizamos la caché sin sobrescribir global.cache
  global.cache[paginationKey] = { data, expiration: timestamp + EXPIRATION_TIME };
};

// Función para guardar los datos de un personaje en caché
const savePeopleInCache = (uid: string, data: StarWars, timestamp: number) => {
  // Actualizamos la caché sin sobrescribir global.cache
  global.cache[uid] = { data, expiration: timestamp + EXPIRATION_TIME };
};

// Función para verificar si la caché es válida (dentro de los últimos 5 minutos)
function cacheExists(key: string): boolean {
  const cacheEntry = global.cache[key];

  // Verificamos si la caché existe
  return cacheEntry ? true: false;
}

function isCacheValid (key:string): boolean {
  const cacheEntry = global.cache[key];
  const currentTime= new Date().getTime();

  // verificamos que el tiempo de expiration (tiempo actual + 5 min) sea mayor al tiempo actual
  return currentTime < cacheEntry.expiration;
}
