import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const activeEntry = await prisma.timeEntry.findFirst({
      where: { endTime: null },
      include: { project: true },
      orderBy: { startTime: "desc" },
    })

    return NextResponse.json(activeEntry)
  } catch (error) {
    console.error("Failed to fetch active entry:", error)
    return NextResponse.json(
      { error: "Failed to fetch active entry" },
      { status: 500 }
    )
  }
}
