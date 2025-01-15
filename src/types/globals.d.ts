import { StarWars } from "../api/interfaces/starwars.interface";
import { StarWarsPagination } from "../api/interfaces/starwarsPagination.interface";

// Inicialización global de la variable de caché
/* 🗂️ **Declaración global de la variable `cache`** 🗂️
   - Se declara `global.cache` como un objeto que puede contener:
     - 🧑‍🚀 **Personajes individuales**: identificados por `uid`, con propiedades `data` de tipo `StarWars` o `unknown` y `expiration` de tipo `number`.
     - 📄 **Resultados de paginación**: identificados por `paginationKey`, con propiedades `data` de tipo `StarWarsPagination` o `unknown` y `expiration` de tipo `number`.
   - Se utiliza `Record<string, { data: StarWars | unknown; expiration: number; }>` para definir la estructura de `cache`. 📚
   - La aserción de tipo `as` indica a TypeScript que `global.cache` seguirá la estructura definida. 🛠️
*/
declare global {
  // eslint-disable-next-line no-var
  var cache: {
    // 🧑‍🚀 **Cache para personajes individuales** (ruta /people/:uid)
    [uid: string]: {
      data: StarWars | unknown, // 🧑‍🚀 Datos del personaje o tipo desconocido
      expiration: number // ⏳ Tiempo de expiración en milisegundos
    };

    // 📄 **Cache para resultados de paginación** (ruta /people)
    // 🔢 Combinación de page y limit como clave
    [paginationKey: string]: {
      data: StarWarsPagination | unknown, // 📄 Datos de paginación o tipo desconocido
      expiration: number // ⏳ Tiempo de expiración en milisegundos
    };
  };
}


// Se necesita esto para que el archivo sea tratado como un módulo
export {};


