import "server-only";

import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { MongoClient } from "mongodb";

import type { BookingRecord } from "@/types";

const localDataDirectory = path.join(process.cwd(), "data");
const vercelDataDirectory = path.join("/tmp", "rz-dental");

let mongoClientPromise: Promise<MongoClient> | null = null;

function getDataDirectory() {
  return process.env.VERCEL ? vercelDataDirectory : localDataDirectory;
}

function getFilePath() {
  return path.join(getDataDirectory(), "bookings.json");
}

async function persistToFile(booking: BookingRecord) {
  const dataDirectory = getDataDirectory();
  const filePath = getFilePath();

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

async function getMongoClient(uri: string) {
  if (!mongoClientPromise) {
    const client = new MongoClient(uri);
    mongoClientPromise = client.connect().then(() => client);
  }

  return mongoClientPromise;
}

export async function persistBooking(booking: BookingRecord) {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    await persistToFile(booking);
    return;
  }

  try {
    const client = await getMongoClient(mongoUri);

    await client
      .db(process.env.MONGODB_DB_NAME || "rz-dental")
      .collection(process.env.MONGODB_COLLECTION || "bookings")
      .insertOne(booking);
  } catch (error) {
    console.error("MongoDB persistence failed, falling back to file storage", error);
    await persistToFile(booking);
  }
}
