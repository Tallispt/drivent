import { requestError } from "@/errors";
import { CreateTicket } from "@/protocols";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketsRepository from "@/repositories/ticket-repository";
import ticketTypesRepository from "@/repositories/ticket-types-repository";

async function getAllTicketTypes() {
  return await ticketTypesRepository.find();
}

async function getAllTickets(userId: number) {
  const enrollment = await enrollmentExists(userId);

  const ticket = await ticketsRepository.findByEnrollmentId(enrollment.id);

  if (!ticket) {
    throw requestError(404, "BAD_REQUEST");
  }

  return ticket;
}

async function createTicket(ticketTypeId: number, userId: number) {
  const enrollment = await enrollmentExists(userId);

  const data = {
    status: "RESERVED",
    Enrollment: enrollment.id,
    TicketType: ticketTypeId
  } as CreateTicket;

  return await ticketsRepository.create(data);
}

async function enrollmentExists(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);

  if (!enrollment) {
    throw requestError(404, "BAD_REQUEST");
  }
  return enrollment;
}

export const ticketsServices = {
  getAllTicketTypes,
  getAllTickets,
  createTicket
};
