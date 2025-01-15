import Joi from 'joi';
/*
  force: Joi.bool().optional() ➡️ ESTRICTO 🟰 Solo válido si query param fuera boolean. al ser siempre string "true" OR "false" no funcionará
  force: Joi.boolean().truthy('true', '1').falsy('false', '0').optional(),
  */
const starwarsReqQuerySchema = Joi.object({
  force: Joi.boolean().truthy('true').falsy('false').optional(),
  page: Joi.number().integer().optional(),
  limit: Joi.number().integer().optional(),
  maxValue: Joi.number().valid(83).required(), // valor máximo de people

})
.with('page', 'limit')
.custom((value, helper) => {
  // Multiplicamos page * limit
  const result = value.page * value.limit;

  // Verificamos que resultado no sea superior al valor máximo de people
  if (result > value.maxValue) {
    return helper.message({
      error: ` (operation = page * limit) can't be greater than ${value.maxValue}`
    });
  }
  return value; // si la validación es correcta, retornar el valor sin cambios
});

const starwarsUidSchema = Joi.object({
  uid: Joi.number().min(1).max(83).required()
})

export { starwarsReqQuerySchema, starwarsUidSchema };
