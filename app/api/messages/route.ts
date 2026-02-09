import { NextRequest, NextResponse } from 'next/server'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
const API_TOKEN = process.env.API_TOKEN || ''

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  const params = new URLSearchParams()
  for (const key of ['limit', 'after', 'before']) {
    const value = searchParams.get(key)
    if (value) params.set(key, value)
  }

  const query = params.toString()
  const url = `${API_URL}/api/v1/messages${query ? `?${query}` : ''}`

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
    },
  })

  const data = await response.json()
  return NextResponse.json(data, { status: response.status })
}

export async function POST(request: NextRequest) {
  const body = await request.json()

  const response = await fetch(`${API_URL}/api/v1/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  const data = await response.json()
  return NextResponse.json(data, { status: response.status })
}
