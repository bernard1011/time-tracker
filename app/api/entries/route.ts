import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    const where: Record<string, unknown> = {}

    if (startDate && endDate) {
      where.startTime = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      }
    }

    const entries = await prisma.timeEntry.findMany({
      where,
      include: { project: true },
      orderBy: { startTime: "desc" },
    })

    return NextResponse.json(entries)
  } catch (error) {
    console.error("Failed to fetch entries:", error)
    return NextResponse.json(
      { error: "Failed to fetch entries" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { taskName, projectId, startTime, endTime, duration } = body

    if (!taskName || !startTime) {
      return NextResponse.json(
        { error: "Task name and start time are required" },
        { status: 400 }
      )
    }

    const entry = await prisma.timeEntry.create({
      data: {
        taskName,
        projectId: projectId || null,
        startTime: new Date(startTime),
        endTime: endTime ? new Date(endTime) : null,
        duration: duration || null,
      },
      include: { project: true },
    })

    return NextResponse.json(entry, { status: 201 })
  } catch (error) {
    console.error("Failed to create entry:", error)
    return NextResponse.json(
      { error: "Failed to create entry" },
      { status: 500 }
    )
  }
}
