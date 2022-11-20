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

async function findByTicketId(id: number) {
  return await prisma.ticket.findFirst({
    where: {
      id
    },
    include: {
      TicketType: true,
      Enrollment: true
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

async function updateByTicketId(id: number) {
  await prisma.ticket.update({
    data: {
      status: "PAID"
    },
    where: {
      id
    }
  });
}

const ticketsRepository = {
  findByEnrollmentId,
  findByTicketId,
  create,
  updateByTicketId
};

export default ticketsRepository;
