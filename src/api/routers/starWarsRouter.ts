import { Router } from 'express';
import { getPeopleByNumber } from '../controllers/starWarsController';
import { validateRequest } from '../middlewares/starWarsRequestValidation';
import { starwarsUidSchema } from '../../models/starwarsSchemas';

export const starWarsRouter = Router();

starWarsRouter.get('/:uid', validateRequest(starwarsUidSchema, 'params'), getPeopleByNumber);


