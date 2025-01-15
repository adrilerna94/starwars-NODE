import './loadEnvironment';
import type { Request, Response } from 'express';
import express from 'express';
import apiRouter from './api/index';
import { StarWars } from './api/interfaces/starwars.interface';

// Inicialización global de cache

global.cache = {} as Record<number, {data: StarWars, expiration: number}>;


const app = express();

app.use('/api', apiRouter);
app.get ('/ping', (req: Request, res: Response) => res.send('pong'));

export default app;
