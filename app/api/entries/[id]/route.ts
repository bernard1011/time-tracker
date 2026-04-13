import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const entry = await prisma.timeEntry.findUnique({
      where: { id },
      include: { project: true },
    })

    if (!entry) {
      return NextResponse.json({ error: "Entry not found" }, { status: 404 })
    }

    return NextResponse.json(entry)
  } catch (error) {
    console.error("Failed to fetch entry:", error)
    return NextResponse.json(
      { error: "Failed to fetch entry" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { taskName, projectId, startTime, endTime, duration } = body

    const updateData: Record<string, unknown> = {}
    if (taskName !== undefined) updateData.taskName = taskName
    if (projectId !== undefined) updateData.projectId = projectId || null
    if (startTime !== undefined) updateData.startTime = new Date(startTime)
    if (endTime !== undefined)
      updateData.endTime = endTime ? new Date(endTime) : null
    if (duration !== undefined) updateData.duration = duration

    const entry = await prisma.timeEntry.update({
      where: { id },
      data: updateData,
      include: { project: true },
    })

    return NextResponse.json(entry)
  } catch (error) {
    console.error("Failed to update entry:", error)
    return NextResponse.json(
      { error: "Failed to update entry" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.timeEntry.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to delete entry:", error)
    return NextResponse.json(
      { error: "Failed to delete entry" },
      { status: 500 }
    )
  }
}
