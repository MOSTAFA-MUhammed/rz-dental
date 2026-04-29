import { NextResponse } from "next/server";

import { createBooking } from "@/services/booking-server";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const result = await createBooking(payload);

    if (!result.ok) {
      return NextResponse.json(
        { ok: false, message: result.message, fieldErrors: result.fieldErrors },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        ok: true,
        message: "Your booking has been successfully submitted",
        bookingId: result.bookingId,
        notifications: result.notifications,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Booking submission failed", error);

    return NextResponse.json(
      {
        ok: false,
        fieldErrors: {},
        message: "Something went wrong while submitting your booking.",
      },
      { status: 500 },
    );
  }
}
