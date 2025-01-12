import { type NextFunction, type Request, type Response } from 'express';
import type Joi from 'joi';
import { ParsedQs }from 'qs';

const validateRequest = <ReqParams, ReqQuery = ParsedQs>(schema: Joi.ObjectSchema, reqType: 'params' | 'query') => {

  return (req: Request<ReqParams, never, ReqQuery>, res: Response, next: NextFunction) => {

    // Modificación: Se permite req.query con el tipo ParsedQs
    const reqToValidate: ReqParams | ParsedQs = req[reqType];

    if (!reqToValidate) {
      return next(new Error("Invalid request Type: Expected 'params' OR 'query"));
    }

    const validation = schema.validate(reqToValidate, {abortEarly: false});

    if (validation.error) {

      const errorMsn = validation.error.details.map(err=> ({
        field: err.path.join('.'),// convert ['path'] to 'path'
        message: err.message,
        type: err.type
      }));

      return res.status(400).send({errors: errorMsn});
    }
    next();
  }
}

export { validateRequest } ;

/*
  🔍 **Explicación del código:**

  1. **Tipo de `req[reqType]`:**
     🧭 `reqType` puede ser `'body'`, `'params'` o `'query'`, y `req[reqType]` puede ser uno de esos tres ( `req.body`, `req.params`, `req.query`).

  2. **Asignación de tipo flexible:**
     💡 `reqToValidate` es de tipo `ReqParams | ReqBody | ReqQuery`, lo que permite manejar cualquiera de las tres propiedades de `req` sin conflicto de tipo.

  3. **No hay conflicto de tipo:**
     ✔️ Al usar un tipo de **unión** ( `ReqParams | ReqBody | ReqQuery` ), TypeScript sabe que `reqToValidate` puede ser cualquiera de esas tres propiedades, y no lanza un error.

  🔄 **Posible error en el primer ejemplo:**
  ⚠️ En el primer ejemplo, el tipo `req.query` es `ParsedQs`, que no es compatible con el tipo `ReqQuery` definido, lo que genera un desajuste de tipos.

  ✍️ **Solución:**
  🔧 Asegúrate de que `ReqQuery` sea compatible con `ParsedQs` o asigna `req.query` a `ParsedQs` como tipo predeterminado para evitar el error.
*/
