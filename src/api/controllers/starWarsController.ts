import { type Request, type Response } from "express";
import axios from "axios";

const url = "https://www.swapi.tech/api/people/";

export const getPeopleByNumber =  async (req: Request, res: Response) => {
  const uid = req.params.uid;
  const data = await getData(uid);

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
    data
  });
}

async function getData (uid:string) {
  try {
    const result = await axios.get(`${url}${uid}`, {timeout: 5000}); // esperamos a que la solicitud se complete
    const character = result.data;

     // Verificamos si la respuesta contiene el campo `result` y luego `properties`
    if (!character || !character.result || !character.result.properties) {
      console.log('Data not found');
      return null; // Si no se encuentra el personaje, retornamos null
    }
    return character;
  } catch (error) {
    console.error('Error fetching data from API:', error);
    return null; // Si hay un error al hacer la solicitud, retornamos null
  }

}
