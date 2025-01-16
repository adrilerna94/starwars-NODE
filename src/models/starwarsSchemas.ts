import Joi from 'joi';

const starwarsReqQuerySchema = Joi.object({
  force: Joi.boolean().truthy('true').falsy('false').optional(),
  page: Joi.number().integer().optional(),
  limit: Joi.number().integer().optional(),
})

/* .and('property1', 'property2')
  Comportamiento:
  1) Si ambos campos están presentes: La validación pasará sin problemas.
  2) Si solo uno de los campos está presente (por ejemplo, solo page o solo limit): Se generará un error, ya que ambos deben estar presentes si uno lo está.
  3) Si ninguno de los campos está presente: No se generará error, ya que ambos campos son opcionales.

*/
.and('page', 'limit')
// si existe page tambien limit ➡️ .with('page', 'limit')
.custom((value, helper) => {

// Verificamos que 'page' y 'limit' estén definidos
  if (value.page && value.limit) {
  // Multiplicamos page * limit
    const result = value.page * value.limit;

  // Verificamos que el resultado no sea superior al valor máximo permitido (por ejemplo, 83)
    if (result > 83) {
      return helper.message({
        'any.custom': `La operación ${value.page} * ${value.limit} no puede ser mayor que 83`,
      });
    }
  }
  return value; // Si la validación es correcta, retornamos el valor sin cambios
});

const starwarsUidSchema = Joi.object({
  uid: Joi.number().min(1).max(83).required()
})

export { starwarsReqQuerySchema, starwarsUidSchema };
