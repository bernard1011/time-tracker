import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"

const defaultProjects = [
  { name: "Development", color: "#3B82F6" },
  { name: "Design", color: "#8B5CF6" },
  { name: "Marketing", color: "#10B981" },
  { name: "Meetings", color: "#F59E0B" },
]

export async function POST() {
  try {
    // Check if projects already exist
    const existingProjects = await prisma.project.count()

    if (existingProjects === 0) {
      // Create default projects
      await prisma.project.createMany({
        data: defaultProjects,
      })
      return NextResponse.json({ message: "Database seeded successfully" })
    }

    return NextResponse.json({ message: "Database already has data" })
  } catch (error) {
    console.error("Failed to seed database:", error)
    return NextResponse.json(
      { error: "Failed to seed database" },
      { status: 500 }
    )
  }
}
