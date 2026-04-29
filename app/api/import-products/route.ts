import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { getProductsExcelPath } from "@/lib/products";

export const dynamic = "force-dynamic";

const allowedExtensions = new Set([".xlsx"]);

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return Response.json(
      { message: "Upload a .xlsx file in the 'file' field." },
      { status: 400 },
    );
  }

  const extension = path.extname(file.name).toLowerCase();

  if (!allowedExtensions.has(extension)) {
    return Response.json(
      { message: "Only .xlsx files are supported." },
      { status: 400 },
    );
  }

  const excelPath = getProductsExcelPath();
  await mkdir(path.dirname(excelPath), { recursive: true });
  await writeFile(excelPath, Buffer.from(await file.arrayBuffer()));

  return Response.json({
    message: "Excel file uploaded successfully.",
    path: excelPath,
  });
}
