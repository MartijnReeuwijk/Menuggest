import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['domain/**/*.test.ts', 'shared/**/*.test.ts', 'scripts/**/*.test.ts'],
    environment: 'node',
  },
})
