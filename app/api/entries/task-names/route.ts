import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const entries = await prisma.timeEntry.findMany({
      select: { taskName: true },
      distinct: ["taskName"],
      orderBy: { createdAt: "desc" },
      take: 50,
    })

    const taskNames = entries.map((e) => e.taskName)
    return NextResponse.json(taskNames)
  } catch (error) {
    console.error("Failed to fetch task names:", error)
    return NextResponse.json(
      { error: "Failed to fetch task names" },
      { status: 500 }
    )
  }
}
