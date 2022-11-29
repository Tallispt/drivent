import { prisma } from "@/config";
import { Prisma } from "@prisma/client";

async function findByUserId(userId: number) {
  return await prisma.booking.findFirst({
    where: {
      userId
    },
    include: {
      Room: true
    }
  });
}

async function create(data: Prisma.BookingUncheckedCreateInput) {
  return await prisma.booking.create({
    data
  });
}

async function edit(data: Prisma.BookingUncheckedUpdateInput, id: number) {
  return await prisma.booking.update({
    where: {
      id
    },
    data
  });
}

const bookingRepository = {
  findByUserId,
  create,
  edit
};

export default bookingRepository;
