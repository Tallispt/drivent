import { notFoundError } from "@/errors";
import { forbiddenError } from "@/errors/forbidden-error";
import bookingRepository from "@/repositories/booking-repository";
import roomsRepository from "@/repositories/rooms.repository";
import ticketsRepository from "@/repositories/ticket-repository";
import { exclude } from "@/utils/prisma-utils";

async function findBooking(userId: number) {
  const booking = await bookingRepository.findByUserId(userId);

  if (!booking) {
    throw notFoundError();
  }

  return exclude(booking, "userId", "roomId", "createdAt", "updatedAt");
}

async function createBooking(userId: number, roomId: number) {
  await userHasValidTicket(userId);
  await validateRoom(roomId);

  const { id } = await bookingRepository.create({
    userId,
    roomId
  });

  return { bookingId: id };
}

async function editBooking(userId: number, roomId: number) {
  await userHasValidTicket(userId);
  await validateRoom(roomId);

  const booking = await bookingRepository.findByUserId(userId);

  if (!booking) {
    throw forbiddenError();
  }

  const { id } = await bookingRepository.edit({ roomId }, booking.id);

  return { bookingId: id };
}

async function userHasValidTicket(userId: number) {
  const ticket = await ticketsRepository.findByUserId(userId);

  if (!ticket || ticket?.TicketType.isRemote || ticket?.status !== "PAID" || !ticket?.TicketType.includesHotel) {
    throw forbiddenError();
  }
}

async function validateRoom(roomId: number) {
  const room = await roomsRepository.findById(roomId);

  if (!room) {
    throw notFoundError();
  }

  if (room.Booking.length === room.capacity) {
    throw forbiddenError();
  }
}

const bookingServices = {
  findBooking,
  createBooking,
  editBooking
};

export default bookingServices;
