import type {
  BookingPayload,
  BookingResponse,
  BookingValidationErrors,
} from "@/types";

type BookingApiPayload = {
  bookingId?: string;
  fieldErrors?: BookingValidationErrors;
  message?: string;
  notifications?: {
    emailSent: boolean;
    whatsappSent: boolean;
  };
  ok?: boolean;
};

export async function submitBooking(payload: BookingPayload): Promise<BookingResponse> {
  const response = await fetch("/api/bookings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = (await response.json()) as BookingApiPayload;

  if (response.ok) {
    return {
      bookingId: data.bookingId ?? "",
      message: data.message ?? "Your booking has been successfully submitted",
      notifications: data.notifications ?? {
        emailSent: false,
        whatsappSent: false,
      },
      ok: true,
    };
  }

  return {
    fieldErrors: data.fieldErrors ?? {},
    message: data.message ?? "Something went wrong while submitting your booking.",
    ok: false,
  };
}
