import { notFoundError } from "@/errors";
import { forbiddenError } from "@/errors/forbidden-error";
import bookingRepository from "@/repositories/booking-repository";
import roomsRepository from "@/repositories/rooms.repository";
import ticketsRepository from "@/repositories/ticket-repository";
import { exclude } from "@/utils/prisma-utils";
import { TicketStatus } from "@prisma/client";

async function findBooking(userId: number) {
  const booking = await bookingRepository.findByUserId(userId);

  if (!booking) {
    throw notFoundError();
  }

  return exclude(booking, "userId", "roomId", "createdAt", "updatedAt");
}

async function createBooking(userId: number, roomId: number) {
  if (await userHasBooking(userId)) {
    throw forbiddenError();
  }

  await userHasValidTicket(userId);
  await validateRoom(roomId);

  const { id } = await bookingRepository.create({
    userId,
    roomId
  });

  return { bookingId: id };
}

async function editBooking(userId: number, roomId: number, bookingId: number) {
  await userHasValidTicket(userId);
  await validateRoom(roomId);

  if (!(await userHasBooking(userId))) {
    throw forbiddenError();
  }
  const { id } = await bookingRepository.edit({ roomId }, bookingId);

  return { bookingId: id };
}

async function userHasBooking(userId: number) {
  const booking = await bookingRepository.findByUserId(userId);
  if (booking) {
    return true;
  } else return false;
}

async function userHasValidTicket(userId: number) {
  const ticket = await ticketsRepository.findByUserId(userId);

  if (!ticket || ticket?.TicketType.isRemote || ticket?.status !== TicketStatus.PAID || !ticket?.TicketType.includesHotel) {
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
