import { TicketStatus } from "@prisma/client";

export type ApplicationError = {
  name: string;
  message: string;
};

export type ViaCEPAddress = {
  logradouro: string,
  complemento: string,
  bairro: string,
  localidade: string,
  uf: string,

};

//Regra de Negócio
export type AddressEnrollment = {
  logradouro: string,
  complemento: string,
  bairro: string,
  cidade: string,
  uf: string,
  error?: string

}

export type RequestError = {
  status: number,
  data: object | null,
  statusText: string,
  name: string,
  message: string,
};

export type CreateTicket = {
  status: TicketStatus;
  Enrollment: number;
  TicketType: number;
}

export type PaymentData = {
  ticketId: number,
  cardData: {
    issuer: string,
    number: string,
    name: string,
    expirationDate: Date,
    cvv: string
  }
}

export type CreatePayment = {
  ticketId: number,
  value: number,
  cardIssuer: IssuerType,
  cardLastDigits: string
}

type IssuerType = "VISA" | "MASTERCARD"
