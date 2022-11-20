import Joi from "joi";

export const PaymentSchema = Joi.object({
  ticketId: Joi.number().required(),
  cardData: Joi.object({
    issuer: Joi.string().required(),
    number: Joi.number().integer().min(10 ** 15).max(10 ** 16 - 1).required(),
    name: Joi.string().required(),
    expirationDate: Joi.date().required(),
    cvv: Joi.number().integer().min(100).max(999).required()
  })
});
