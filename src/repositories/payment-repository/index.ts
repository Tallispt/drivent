import { prisma } from "@/config";
import { Prisma } from "@prisma/client";

async function findByTicketId(ticketId: number) {
  return await prisma.payment.findFirst({
    where: {
      ticketId
    },
    include: {
      Ticket: {
        include: {
          Enrollment: true
        }
      }
    }
  });
}

async function create(data: Prisma.PaymentUncheckedCreateInput) {
  return await prisma.payment.create({
    data
  });
}

const paymentRepository = {
  findByTicketId,
  create
};

export default paymentRepository;
