import './loadEnvironment';
import type { Request, Response } from 'express';
import express from 'express';
import apiRouter from './api/index';

const app = express();

app.use('/api', apiRouter);
app.get ('/ping', (req: Request, res: Response) => res.send('pong'));

export default app;
