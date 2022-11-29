import Joi, { number } from "joi";

export const RoomIdSchema = Joi.object({
  roomId: number().integer().required()
});
