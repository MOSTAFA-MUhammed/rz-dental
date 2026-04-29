import "server-only";

import { access } from "node:fs/promises";
import path from "node:path";

import ExcelJS from "exceljs";

import type { Product } from "@/types";

const DEFAULT_SHEET_ID = "1yW8veicvPfHoByYHMx8NuRI9DSQYB7DyafuaLU-Xa6k";
const DEFAULT_SHEET_NAME = "Sheet1";

type GoogleSheetCell = {
  f?: string;
  v?: string | number | boolean | null;
};

type GoogleSheetTable = {
  cols?: Array<{ label?: string }>;
  rows?: Array<{ c?: Array<GoogleSheetCell | null> }>;
};

type GoogleSheetResponse = {
  table?: GoogleSheetTable;
};

type ParsedSheetRow = Record<string, string>;
type ProductImageAsset = {
  buffer: Buffer;
  contentType: string;
};

const DEFAULT_EXCEL_PATH = path.join(
  /*turbopackIgnore: true*/ process.cwd(),
  "data",
  "products.xlsx",
);

function toSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseNumber(value: string | undefined) {
  if (!value) {
    return 0;
  }

  const normalized = value.replace(/[^0-9.-]/g, "");
  const parsed = Number(normalized);

  return Number.isFinite(parsed) ? parsed : 0;
}

function parseBoolean(value: string | undefined) {
  const normalized = value?.trim().toLowerCase();
  return normalized === "true" || normalized === "1" || normalized === "yes";
}

function parseCategoryTags(value: string | undefined) {
  if (!value) {
    return ["Dental Products"];
  }

  const seen = new Set<string>();

  return value
    .split("-")
    .map((segment) => segment.trim())
    .filter(Boolean)
    .filter((segment) => {
      const normalized = segment.toLowerCase();

      if (seen.has(normalized)) {
        return false;
      }

      seen.add(normalized);
      return true;
    });
}

function resolvePrice(priceValue: string, offerPriceValue: string) {
  const price = parseNumber(priceValue);
  const discount = parseNumber(offerPriceValue);

  if (!offerPriceValue.trim() || discount <= 0) {
    return { originalPrice: undefined, price };
  }

  return {
    originalPrice: price,
    price: Math.max(0, price - discount),
  };
}

function normalizeImagePath(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return "/products/composite-kit.svg";
  }

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("/")) {
    return trimmed;
  }

  return `/products/${trimmed}`;
}

function getExcelFilePath() {
  return process.env.PRODUCTS_EXCEL_PATH || DEFAULT_EXCEL_PATH;
}

function getContentTypeFromExtension(extension: string | undefined) {
  switch ((extension || "").toLowerCase()) {
    case "jpeg":
    case "jpg":
      return "image/jpeg";
    case "gif":
      return "image/gif";
    case "webp":
      return "image/webp";
    case "svg":
      return "image/svg+xml";
    case "png":
    default:
      return "image/png";
  }
}

function stringifyExcelCell(value: ExcelJS.CellValue | undefined) {
  if (value == null) {
    return "";
  }

  if (typeof value === "object" && "text" in value && typeof value.text === "string") {
    return value.text;
  }

  return String(value);
}

function parseGoogleSheetRows(payload: string) {
  const match = payload.match(/setResponse\(([\s\S]+)\);?$/);

  if (!match?.[1]) {
    throw new Error("Invalid Google Sheets response format.");
  }

  const parsed = JSON.parse(match[1]) as GoogleSheetResponse;
  const cols = parsed.table?.cols ?? [];
  const rows = parsed.table?.rows ?? [];

  return rows.map((row) => {
    const record: ParsedSheetRow = {};

    row.c?.forEach((cell, index) => {
      const rawLabel = cols[index]?.label?.trim() || `column_${index}`;
      const normalizedLabel = rawLabel.toLowerCase().replace(/\s+/g, "_");
      record[normalizedLabel] = String(cell?.v ?? cell?.f ?? "").trim();
    });

    return record;
  });
}

function mapSheetRowToProduct(row: ParsedSheetRow): Product | null {
  const name = row.name?.trim();

  if (!name) {
    return null;
  }

  const id = row.id?.trim() || toSlug(name);
  const description = row.description || row.descrption || "No description available yet.";
  const category = row.category?.trim() || "Dental Products";
  const categoryTags = parseCategoryTags(category);
  const brand = row.brand?.trim() || undefined;
  const image = normalizeImagePath(row.image || "");
  const { originalPrice, price } = resolvePrice(row.price || "", row.offer_price || "");
  const inStock = parseBoolean(row.stock);
  const warranty = row.warranty?.trim() || undefined;

  return {
    brand,
    category,
    categoryTags,
    description,
    id,
    image,
    inStock,
    name,
    originalPrice,
    price,
    warranty,
  };
}

async function loadProductsFromExcel(): Promise<{
  images: Map<string, ProductImageAsset>;
  products: Product[];
} | null> {
  const excelPath = getExcelFilePath();

  try {
    await access(excelPath);
  } catch {
    return null;
  }

  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(excelPath);

  const worksheet = workbook.worksheets[0];

  if (!worksheet) {
    return { images: new Map(), products: [] };
  }

  const headerRow = worksheet.getRow(1);
  const columnMap = new Map<number, string>();

  headerRow.eachCell({ includeEmpty: true }, (cell, columnNumber) => {
    const rawLabel = stringifyExcelCell(cell.value).trim() || `column_${columnNumber}`;
    const normalizedLabel = rawLabel.toLowerCase().replace(/\s+/g, "_");
    columnMap.set(columnNumber, normalizedLabel);
  });

  const mediaEntries = ((workbook.model as unknown as { media?: Array<{
    buffer?: Buffer;
    extension?: string;
    type?: string;
  }> }).media || []);

  const rowImages = new Map<number, ProductImageAsset>();

  for (const worksheetImage of worksheet.getImages()) {
    const imageIndex = Number(worksheetImage.imageId);
    const medium = mediaEntries[imageIndex] || mediaEntries[imageIndex - 1];

    if (!medium?.buffer || medium.type !== "image") {
      continue;
    }

    const asset = {
      buffer: Buffer.from(medium.buffer),
      contentType: getContentTypeFromExtension(medium.extension),
    };

    const topRow = Math.floor(worksheetImage.range.tl.row) + 1;
    const bottomRow = worksheetImage.range.br
      ? Math.ceil(worksheetImage.range.br.row)
      : topRow;

    for (let rowNumber = topRow; rowNumber <= bottomRow; rowNumber += 1) {
      if (!rowImages.has(rowNumber)) {
        rowImages.set(rowNumber, asset);
      }
    }
  }

  const images = new Map<string, ProductImageAsset>();
  const products: Product[] = [];

  worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
    if (rowNumber === 1) {
      return;
    }

    const record: ParsedSheetRow = {};

    row.eachCell({ includeEmpty: true }, (cell, columnNumber) => {
      const label = columnMap.get(columnNumber) || `column_${columnNumber}`;
      record[label] = stringifyExcelCell(cell.value).trim();
    });

    const product = mapSheetRowToProduct(record);

    if (!product) {
      return;
    }

    const imageAsset = rowImages.get(rowNumber);

    if (imageAsset) {
      images.set(product.id, imageAsset);
      product.image = `/api/products/image/${encodeURIComponent(product.id)}`;
    }

    products.push(product);
  });

  return { images, products };
}

export async function getProducts() {
  const excelCatalog = await loadProductsFromExcel();

  if (excelCatalog && excelCatalog.products.length > 0) {
    return excelCatalog.products;
  }

  const spreadsheetId = process.env.GOOGLE_SHEETS_PRODUCTS_ID || DEFAULT_SHEET_ID;
  const sheetName = process.env.GOOGLE_SHEETS_PRODUCTS_SHEET || DEFAULT_SHEET_NAME;

  const params = new URLSearchParams({
    sheet: sheetName,
    tqx: "out:json",
  });

  try {
    const response = await fetch(
      `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?${params.toString()}`,
      {
        next: { revalidate: 300 },
      },
    );

    if (!response.ok) {
      throw new Error(`Failed to load products from Google Sheets: ${response.status}`);
    }

    const payload = await response.text();
    const rows = parseGoogleSheetRows(payload);

    return rows
      .map(mapSheetRowToProduct)
      .filter((product): product is Product => product !== null);
  } catch (error) {
    console.error("Falling back to empty product list because Google Sheets fetch failed.", error);
    return [];
  }
}

export async function getFeaturedProducts() {
  const products = await getProducts();
  return products.slice(0, 3);
}

export async function getProductImageById(productId: string) {
  const excelCatalog = await loadProductsFromExcel();

  if (!excelCatalog) {
    return null;
  }

  return excelCatalog.images.get(productId) || null;
}

export function getProductsExcelPath() {
  return getExcelFilePath();
}
