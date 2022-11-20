import { getPayment, postPayment } from "@/controllers";
import { authenticateToken, validateBody } from "@/middlewares";
import { PaymentSchema } from "@/schemas";
import { Router } from "express";

const paymentsRouter = Router();

paymentsRouter
  .all("/*", authenticateToken)
  .get("/", getPayment)
  .post("/process", validateBody(PaymentSchema), postPayment);

export { paymentsRouter };
