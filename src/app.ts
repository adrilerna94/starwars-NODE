import './loadEnvironment';
import type { Request, Response } from 'express';
import { StarWars } from './api/interfaces/starwars.interface';
import { StarWarsPagination } from './api/interfaces/starwarsPagination.interface';
import express from 'express';
import apiRouter from './api/index';


const app = express();

/* 🗂️ **Inicialización de la variable global `cache`** 🗂️
   - Se declara `global.cache` como un objeto vacío que puede contener:
     - **Personajes individuales**: identificados por `uid`, con propiedades `data` de tipo `StarWars` y `expiration` de tipo `number`. 🧑‍🚀
     - **Resultados de paginación**: identificados por `paginationKey`, con propiedades `data` de tipo `StarWarsPagination` y `expiration` de tipo `number`. 📄
   - Se utiliza `Record<string, { data: StarWars | StarWarsPagination; expiration: number; }>` para definir la estructura de `cache`. 📚
   - La aserción de tipo `as` indica a TypeScript que `global.cache` seguirá la estructura definida. 🛠️
*/
global.cache = {} as Record<string, { data: StarWars | StarWarsPagination; expiration: number; }>;

app.use('/api', apiRouter);
app.get ('/ping', (req: Request, res: Response) => res.send('pong'));

export default app;



