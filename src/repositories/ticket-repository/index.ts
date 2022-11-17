import { prisma } from "@/config";
import { CreateTicket } from "@/protocols";

async function findByEnrollmentId(enrollmentId: number) {
  return await prisma.ticket.findFirst({
    where: {
      enrollmentId
    },
    include: {
      TicketType: true
    }
  });
}

async function create(data: CreateTicket) {
  return await prisma.ticket.create({
    data: {
      status: data.status,
      Enrollment: {
        connect: {
          id: data.Enrollment
        }
      },
      TicketType: {
        connect: {
          id: data.TicketType
        }
      }
    },
    include: {
      TicketType: true
    }
  });
}

const ticketsRepository = {
  findByEnrollmentId,
  create
};

export default ticketsRepository;
