import Joi, { number } from "joi";

export const hotelIdSchema = Joi.object({
  hotelId: number().integer()
});
