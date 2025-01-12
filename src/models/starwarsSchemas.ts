import Joi from "joi";

const starwarsRequestSchema = Joi.object({
  uid: Joi.number().min(1).max(83).required(),
  force: Joi.bool().optional(), // parametro opcional. si existe deber ser true or false
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

export { starwarsRequestSchema };
