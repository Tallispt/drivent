import app, { init } from "@/app";
import faker from "@faker-js/faker";
import { TicketStatus } from "@prisma/client";
import httpStatus from "http-status";
import jwt from "jsonwebtoken";
import supertest from "supertest";
import { createEnrollmentWithAddress, createHotel, createPresentialWithHotelTicketType, createRooms, createTicket, createTicketType, createUser } from "../factories";
import { createBooking, findBookingByUserId } from "../factories/booking-factory";
import { cleanDb, generateValidToken } from "../helpers";

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe("GET /booking", () => {
  it("Should respond with status 401 if no token is given", async () => {
    const response = await server.get("/booking");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("Should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("Should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("When token is valid", () => {
    it("Should respond with status 404 if user does not have a booking", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it("should respond with status 200 and with existing booking data", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const hotel = await createHotel();
      const room = await createRooms(hotel.id);
      const booking = await createBooking({
        roomId: room[0].id,
        userId: user.id
      });

      const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual({
        id: booking.id,
        Room: expect.objectContaining({
          id: room[0].id,
          name: room[0].name,
          capacity: room[0].capacity,
          hotelId: room[0].hotelId,
          createdAt: room[0].createdAt.toISOString(),
          updatedAt: room[0].updatedAt.toISOString(),
        })
      });
    });
  });
});

describe("POST /booking", () => {
  it("Should respond with status 401 if no token is given", async () => {
    const response = await server.post("/booking");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("Should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server.post("/booking").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("Should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.post("/booking").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("When token is valid", () => {
    it("Should respond with respond with status 400 when roomId is not on the body", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const response = await server.post("/booking").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it("Should respond with respond with status 400 when roomId is not a number", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const roomId = faker.lorem.word(1);

      const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send({ roomId });

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it("Should respond status 403 if user does not have a ticket", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      await createEnrollmentWithAddress(user);
      await createTicketType();
      const roomId = faker.datatype.number(10);

      const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send({ roomId });

      expect(response.status).toBe(httpStatus.FORBIDDEN);
    });

    it("Should respond status 403 if user does not have a paid presencial ticket", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType();
      await createTicket(enrollment.id, ticketType.id, "RESERVED");
      const roomId = faker.datatype.number(10);

      const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send({ roomId });

      expect(response.status).toBe(httpStatus.FORBIDDEN);
    });

    it("Should respond status 404 if room does not exist", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createPresentialWithHotelTicketType();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const roomId = faker.datatype.number(10);

      const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send({ roomId });

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it("Should respond status 403 if room does not have vacancies", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createPresentialWithHotelTicketType();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

      const otherUser = await createUser();
      const otherEnrollment = await createEnrollmentWithAddress(otherUser);
      const otheTicketType = await createPresentialWithHotelTicketType();
      await createTicket(otherEnrollment.id, otheTicketType.id, TicketStatus.PAID);

      const hotel = await createHotel();
      const room = await createRooms(hotel.id, undefined, 1);
      const roomId = room[0].id;
      await createBooking({ roomId, userId: otherUser.id });

      const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send({ roomId });

      expect(response.status).toBe(httpStatus.FORBIDDEN);
    });

    it("Should respond status 200 and booking data", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createPresentialWithHotelTicketType();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const hotel = await createHotel();
      const room = await createRooms(hotel.id);

      const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send({ roomId: room[0].id });

      const booking = await findBookingByUserId(user.id);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual({
        bookingId: booking.id
      });
    });
  });
});

describe("PUT /booking/:bookingId", () => {
  it("Should respond with status 401 if no token is given", async () => {
    const param = faker.datatype.number(10);

    const response = await server.put(`/booking/${param}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("Should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();
    const param = faker.datatype.number(10);

    const response = await server.put(`/booking/${param}`).set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("Should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
    const param = faker.datatype.number(10);

    const response = await server.put(`/booking/${param}`).set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("When token is valid", () => {
    it("Should respond with respond with status 400 when roomId was not sent", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const bookingId = faker.datatype.number(10);

      const response = await server.put(`/booking/${bookingId}`).set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it("Should respond with respond with status 400 when roomId is not a number", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const bookingId = faker.datatype.number(10);
      const roomId = faker.lorem.word(1);

      const response = await server.put(`/booking/${bookingId}`).set("Authorization", `Bearer ${token}`).send({ roomId });

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it("Should respond with respond with status 400 when bookingId is not a number", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const bookingId = faker.lorem.word(1);
      const roomId = faker.datatype.number(10);

      const response = await server.put(`/booking/${bookingId}`).set("Authorization", `Bearer ${token}`).send({ roomId });

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it("Should respond status 403 if user does not have a ticket", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      await createEnrollmentWithAddress(user);
      await createTicketType();
      const bookingId = faker.datatype.number(10);
      const roomId = faker.datatype.number(10);

      const response = await server.put(`/booking/${bookingId}`).set("Authorization", `Bearer ${token}`).send({ roomId });

      expect(response.status).toBe(httpStatus.FORBIDDEN);
    });

    it("Should respond status 403 if user does not have a paid presencial ticket", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType();
      await createTicket(enrollment.id, ticketType.id, "RESERVED");
      const bookingId = faker.datatype.number(10);
      const roomId = faker.datatype.number(10);

      const response = await server.put(`/booking/${bookingId}`).set("Authorization", `Bearer ${token}`).send({ roomId });

      expect(response.status).toBe(httpStatus.FORBIDDEN);
    });

    it("Should respond status 404 if room does not exist", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createPresentialWithHotelTicketType();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const bookingId = faker.datatype.number(10);
      const roomId = faker.datatype.number(10);

      const response = await server.put(`/booking/${bookingId}`).set("Authorization", `Bearer ${token}`).send({ roomId });

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it("Should respond status 403 if user does not have a booking", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createPresentialWithHotelTicketType();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const hotel = await createHotel();
      const room = await createRooms(hotel.id, 1);
      const bookingId = faker.datatype.number(10);
      const roomId = room[0].id;

      const response = await server.put(`/booking/${bookingId}`).set("Authorization", `Bearer ${token}`).send({ roomId });

      expect(response.status).toBe(httpStatus.FORBIDDEN);
    });

    it("Should respond status 403 if room does not have vacancies", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createPresentialWithHotelTicketType();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const hotel = await createHotel();
      const room = await createRooms(hotel.id, 1);
      const roomId = room[0].id;

      const otherUser = await createUser();
      const otherEnrollment = await createEnrollmentWithAddress(otherUser);
      const otheTicketType = await createPresentialWithHotelTicketType();
      await createTicket(otherEnrollment.id, otheTicketType.id, TicketStatus.PAID);
      const booking = await createBooking({ roomId: room[0].id, userId: otherUser.id });
      const bookingId = booking.id;

      const response = await server.put(`/booking/${bookingId}`).set("Authorization", `Bearer ${token}`).send({ roomId });

      expect(response.status).toBe(httpStatus.FORBIDDEN);
    });

    it("Should respond status 200 and booking data", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createPresentialWithHotelTicketType();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const hotel = await createHotel();
      const room = await createRooms(hotel.id);
      const roomId = room[0].id;
      const booking = await createBooking({ roomId: room[0].id, userId: user.id });
      const bookingId = booking.id;

      const response = await server.put(`/booking/${bookingId}`).set("Authorization", `Bearer ${token}`).send({ roomId });

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual({
        bookingId: booking.id
      });
    });
  });
});
