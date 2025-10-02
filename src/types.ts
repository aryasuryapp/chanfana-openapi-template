import type { Context } from "hono";

export type AppContext = Context<{ Bindings: Env }>;
export type HandleArgs = [AppContext];

// Booking types
export interface Booking {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  checkInDate: string;
  checkOutDate: string;
  roomType: string;
  numberOfGuests: number;
  specialRequests?: string;
  totalAmount: number;
  status: "confirmed" | "pending" | "cancelled";
  createdAt: string;
}
