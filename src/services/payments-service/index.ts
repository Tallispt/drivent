import { notFoundError, unauthorizedError } from "@/errors";
import { CreatePayment, PaymentData } from "@/protocols";
import paymentRepository from "@/repositories/payment-repository";
import ticketsRepository from "@/repositories/ticket-repository";
import { exclude } from "@/utils/prisma-utils";

async function getPaymentTicket(ticketId: number, userId: number) {
  const ticket = await paymentRepository.findByTicketId(ticketId);

  if (!ticket) {
    throw notFoundError();
  }

  if (ticket.Ticket.Enrollment.userId != userId) {
    throw unauthorizedError();
  }

  return exclude(ticket, "Ticket");
}

async function postPaymentTicket(paymentData: PaymentData, userId: number) {
  const ticket = await ticketsRepository.findByTicketId(paymentData.ticketId);

  if (!ticket) {
    throw notFoundError();
  }

  if (ticket.Enrollment.userId !== userId) {
    throw unauthorizedError();
  }

  await ticketsRepository.updateByTicketId(paymentData.ticketId);

  const data = {
    ticketId: paymentData.ticketId,
    value: ticket.TicketType.price,
    cardIssuer: paymentData.cardData.issuer,
    cardLastDigits: String(paymentData.cardData.number).slice(-4)
  } as CreatePayment;
  const result = await paymentRepository.create(data);

  return result;
}

const paymentServices = {
  getPaymentTicket,
  postPaymentTicket
};

export default paymentServices;
