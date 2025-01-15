import { type Request, type Response } from "express";
import axios from "axios";
import { StarWars } from "../interfaces/starwars.interface";


const url = "https://www.swapi.tech/api/people/";
const EXPIRATION_TIME = 300_000

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


  /*
  // Si no se encontró o hubo un error, respondemos con un 404
  if (!data) {
    return res.status(404).json({
      status: 'Fail',
      msn: `Star Wars character with ID ${uid} NOT FOUND`
    });
  }
  // Respondemos con los datos del personaje
  return res.status(200).json({
    status: 'Success',
    character: data.result.properties.name,
    data,
  });

  */

async function getCachedData (uid: string, force: boolean) {
  const currentTime = new Date().getTime(); // time in ms
  if (force) {
    return await fetchDataFromApi(uid);
  }

  // verificamos si hay datos en cache y si no han expirado
  if (global.cache[uid]) {
    const { data, expiration } = global.cache[uid];
    if (currentTime < expiration) {
      return data; // si cache es válido devolvemos datos
    }
  }
  // si no tenemos datos en la cache o el cache ha expirado, hacemos la solicitud
  return await fetchDataFromApi(uid);


}

async function fetchDataFromApi (uid:string) {
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
    saveInCache(uid, data, timestamp);

    return data;

  } catch (error) {
    console.error('Error fetching data from API:', error);
    return null; // Si hay un error al hacer la solicitud, retornamos null
  }

}

const saveInCache = async (uid: string, data: StarWars, timestamp: number) => {

 global.cache = { [uid]: {data, expiration: timestamp + EXPIRATION_TIME} }

};
