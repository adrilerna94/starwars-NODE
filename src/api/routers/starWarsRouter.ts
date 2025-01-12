import { Router } from 'express';
import { getPeopleByNumber } from '../controllers/starWarsController';

export const starWarsRouter = Router();

starWarsRouter.get('/:uid', getPeopleByNumber);


// export default starWarsRouter;
