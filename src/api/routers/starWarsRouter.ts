import { Router } from 'express';
// import { getPeopleByNumber} from '../controllers/starWarsController';
import {getPeopleWithPagination, getPeopleByNumber} from '../controllers/starWarsController';
import { validateRequest } from '../middlewares/starWarsRequestValidation';
import { starwarsReqQuerySchema, starwarsUidSchema } from '../../models/starwarsSchemas';

export const starWarsRouter = Router();

starWarsRouter.get('/:uid', validateRequest(starwarsUidSchema, 'params'), getPeopleByNumber);
starWarsRouter.get('/', validateRequest(starwarsReqQuerySchema, 'query'), getPeopleWithPagination);


