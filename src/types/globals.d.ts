import { StarWars } from "../api/interfaces/starwars.interface";
import { StarWarsPagination } from "../api/interfaces/starwarsPagination.interface";

// Inicialización global de la variable de caché
declare global {
  // eslint-disable-next-line no-var
  var cache: {
    // Cache para personajes individuales (ruta /people/:uid)
    [uid: string]: {
      data: StarWars,
      expiration: number
    };

    // Cache para resultados de paginación (ruta /people)
    // Combinación de page y limit como clave
    [paginationKey: string]: {
      data: StarWarsPagination,
      expiration: number
    };
  };
}

// Se necesita esto para que el archivo sea tratado como un módulo
export {};


