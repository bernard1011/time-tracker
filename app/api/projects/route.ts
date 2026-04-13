import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { name: "asc" },
    })
    return NextResponse.json(projects)
  } catch (error) {
    console.error("Failed to fetch projects:", error)
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, color } = body

    if (!name || !color) {
      return NextResponse.json(
        { error: "Name and color are required" },
        { status: 400 }
      )
    }

    const project = await prisma.project.create({
      data: { name, color },
    })

    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    console.error("Failed to create project:", error)
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    )
  }
}
