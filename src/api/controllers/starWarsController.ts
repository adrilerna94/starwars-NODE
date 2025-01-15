import { type Request, type Response } from "express";
import axios from "axios";
import { StarWars } from "../interfaces/starwars.interface";

const url = "https://www.swapi.tech/api/people/";
const EXPIRATION_TIME = 300_000

// Controlador para la ruta /people con paginación
export const getPeopleWithPagination = async (req: Request, res: Response) => {
  const { page, limit } = req.query;

  const pageNumber = parseInt(page as string);
  const limitNumber = parseInt(limit as string);

  const paginationKey = `page-${pageNumber}-limit-${limitNumber}`;

  // Verificamos si los datos están en caché y son válidos
  if (global.cache[paginationKey] && isCacheValid(global.cache[paginationKey])) {
    return res.json(global.cache[paginationKey].data);
  }

  try {
    const response = await axios.get(url, {
      params: { page: pageNumber, limit: limitNumber },
    });

    const timestamp = new Date().getTime();

    // Almacenamos los datos en caché
    global.cache[paginationKey] = { data: response.data, expiration: timestamp + EXPIRATION_TIME };

    return res.json(response.data);
  } catch (error) {
    return res.status(500).json({ error: "Error fetching data from API" });
  }
};

export const getPeopleByNumber =  async (req: Request, res: Response) => {
  const uid = req.params.uid;
  const force = req.query.force === 'true';

  // verificamos si la info está en caché y es válida
  const cachedData = await getCachedData (uid, force);

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

async function getCachedData (uid: string, force: boolean) {
  const currentTime = new Date().getTime(); // time in ms
  if (force) {
    return await fetchPeopleFromApi(uid);
  }

  // verificamos si hay datos en cache y si no han expirado
  if (global.cache[uid]) {
    const { data, expiration } = global.cache[uid];
    if (currentTime < expiration) {
      return data; // si cache es válido devolvemos datos
    }
  }
  // si no tenemos datos en la cache o el cache ha expirado, hacemos la solicitud
  return await fetchPeopleFromApi(uid);

}

async function fetchPeopleFromApi (uid: string) {
  try {
    const response = await axios.get(`${url}${uid}`); // esperamos a que la solicitud se complete
    const data = response.data;

     // Verificamos si la respuesta contiene el campo `result` y luego `properties`
    if (!data || !data.result || !data.result.properties) {
      console.log('Data not found');
      return null; // Si no se encuentra el personaje, retornamos null
    }

    // Guardamos los datos en cacha con la expiración fija
    const timestamp = new Date().getTime();
    savePeopleInCache(uid, data, timestamp);

    return data;

  } catch (error) {
    console.error('Error fetching data from API:', error);
    return null; // Si hay un error al hacer la solicitud, retornamos null
  }

}

const savePaginationInCache = async (page: string, limit: string, data: StarWars, timestamp: number) => {

  const paginationKey = `page-${page}-limit-${limit}`;
  global.cache = { [paginationKey]: {data, expiration: timestamp + EXPIRATION_TIME} }

 };

const savePeopleInCache = async (uid: string, data: StarWars, timestamp: number) => {

 global.cache = { [uid]: {data, expiration: timestamp + EXPIRATION_TIME} }

};

// Función para verificar si la caché es válida (dentro de los últimos 5 minutos)
function isCacheValid(key: string): boolean {
  const cacheEntry = global.cache[key];
  const currentTime = new Date().getTime();

  // Verificamos si la caché existe y si el tiempo de expiración no ha pasado
  return cacheEntry && currentTime < cacheEntry.expiration;
}
