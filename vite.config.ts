import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import type { Plugin } from 'vite'
import type { IncomingMessage, ServerResponse } from 'node:http'

const paymentStore = new Map<string, Record<string, unknown>>()

function webhookPlugin(): Plugin {
  return {
    name: 'payment-webhook-handler',
    configureServer(server) {
      server.middlewares.use('/api/webhook', (req: IncomingMessage, res: ServerResponse) => {
        res.setHeader('Content-Type', 'application/json')
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

        if (req.method === 'OPTIONS') {
          res.statusCode = 204
          res.end()
          return
        }

        if (req.method !== 'POST') {
          res.statusCode = 405
          res.end(JSON.stringify({ error: 'Method not allowed' }))
          return
        }

        let body = ''
        req.on('data', (chunk: Buffer) => { body += chunk.toString() })
        req.on('end', () => {
          try {
            const data = JSON.parse(body) as Record<string, unknown>
            const id = String(data.transaction_id ?? data.order_id ?? data.id ?? '')
            if (id) {
              paymentStore.set(id, data)
              console.log(`\n[Webhook] Payment update received — ID: ${id}, Status: ${data.status}\n`)
            }
            res.statusCode = 200
            res.end(JSON.stringify({ received: true }))
          } catch {
            res.statusCode = 400
            res.end(JSON.stringify({ error: 'Invalid JSON body' }))
          }
        })
      })

      server.middlewares.use('/api/payment-status', (req: IncomingMessage, res: ServerResponse) => {
        res.setHeader('Content-Type', 'application/json')
        const url = new URL(req.url!, 'http://localhost')
        const id = url.searchParams.get('transaction_id') ?? ''

        if (!id) {
          res.statusCode = 400
          res.end(JSON.stringify({ error: 'transaction_id is required' }))
          return
        }

        const data = paymentStore.get(id)
        res.statusCode = 200
        res.end(JSON.stringify(data ?? { status: 'pending', transaction_id: id }))
      })
    },
  }
}

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    webhookPlugin(),
  ],
})
