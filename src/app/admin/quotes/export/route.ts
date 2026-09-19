import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

function escapeCSV(val: string | number | null | undefined): string {
  if (val === null || val === undefined) return "";
  const str = String(val);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export async function GET() {
  const session = await getSession();
  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const quotes = await db.quoteRequest.findMany({
    orderBy: { createdAt: "desc" },
    include: { product: true },
  });

  const headers = [
    "ID",
    "Date",
    "Name",
    "Phone",
    "Email",
    "Company",
    "Product",
    "Quantity",
    "Location",
    "Status",
    "Message",
    "Note",
  ];

  const rows = quotes.map((q) => [
    escapeCSV(q.id),
    escapeCSV(new Date(q.createdAt).toISOString()),
    escapeCSV(q.name),
    escapeCSV(q.phone),
    escapeCSV(q.email),
    escapeCSV(q.company),
    escapeCSV(q.product?.name || "General"),
    escapeCSV(q.quantity),
    escapeCSV(q.location),
    escapeCSV(q.status),
    escapeCSV(q.message),
    escapeCSV(q.note),
  ]);

  const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");

  return new NextResponse(csvContent, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="noor_solar_quotes_${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
