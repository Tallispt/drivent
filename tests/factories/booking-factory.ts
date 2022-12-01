import { prisma } from "@/config";
import { Prisma } from "@prisma/client";

export async function createBooking(data: Prisma.BookingUncheckedCreateInput) {
  return prisma.booking.create({
    data
  });
}

export async function findBookingByUserId(userId: number) {
  return prisma.booking.findFirst({
    where: {
      userId
    }
  });
}
