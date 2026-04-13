import { execSync } from 'child_process'
import { existsSync, mkdirSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const projectRoot = join(__dirname, '..')

// Create prisma directory if it doesn't exist
const prismaDir = join(projectRoot, 'prisma')
if (!existsSync(prismaDir)) {
  mkdirSync(prismaDir, { recursive: true })
}

console.log('Generating Prisma client...')
execSync('npx prisma generate', { cwd: projectRoot, stdio: 'inherit' })

console.log('Pushing schema to database...')
execSync('npx prisma db push', { cwd: projectRoot, stdio: 'inherit' })

console.log('Database setup complete!')
