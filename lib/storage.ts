import "server-only";

import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

import type { BookingRecord } from "@/types";

const dataDirectory = path.join(process.cwd(), "data");
const filePath = path.join(dataDirectory, "bookings.json");

type RequireLike = (specifier: string) => unknown;

async function persistToFile(booking: BookingRecord) {
  await mkdir(dataDirectory, { recursive: true });

  try {
    const existing = await readFile(filePath, "utf-8");
    const bookings = JSON.parse(existing) as BookingRecord[];
    bookings.unshift(booking);
    await writeFile(filePath, JSON.stringify(bookings, null, 2), "utf-8");
  } catch {
    await writeFile(filePath, JSON.stringify([booking], null, 2), "utf-8");
  }
}

export async function persistBooking(booking: BookingRecord, require: RequireLike) {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    await persistToFile(booking);
    return;
  }

  try {
    const mongodb = require("mongodb") as {
      MongoClient: new (uri: string) => {
        connect: () => Promise<void>;
        close: () => Promise<void>;
        db: (name: string) => {
          collection: (name: string) => {
            insertOne: (document: BookingRecord) => Promise<void>;
          };
        };
      };
    };

    const client = new mongodb.MongoClient(mongoUri);
    await client.connect();

    await client
      .db(process.env.MONGODB_DB_NAME || "rz-dental")
      .collection(process.env.MONGODB_COLLECTION || "bookings")
      .insertOne(booking);

    await client.close();
  } catch (error) {
    console.error("MongoDB persistence failed, falling back to file storage", error);
    await persistToFile(booking);
  }
}
