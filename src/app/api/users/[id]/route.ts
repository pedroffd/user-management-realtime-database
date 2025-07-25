import axios from 'axios'
import { type NextRequest, NextResponse } from 'next/server'

const admin = require('firebase-admin')

if (!admin.apps.length) {
  const credential = process.env.FIREBASE_PRIVATE_KEY
    ? admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      })
    : admin.credential.applicationDefault()

  admin.initializeApp({
    credential,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  })
}

const db = admin.database()

async function fetchLocationData(zipcode: string) {
  const apiKey = process.env.OPENWEATHER_API_KEY
  const url = `https://api.openweathermap.org/data/2.5/weather?zip=${zipcode}&appid=${apiKey}`

  try {
    const response = await axios.get(url)
    const { lat, lon } = response.data.coord
    const timezoneOffset = response.data.timezone
    const sign = timezoneOffset >= 0 ? '+' : '-'
    const absOffset = Math.abs(timezoneOffset)
    const hours = Math.floor(absOffset / 3600)
      .toString()
      .padStart(2, '0')
    const minutes = ((absOffset % 3600) / 60).toString().padStart(2, '0')
    const timezone = `UTC${sign}${hours}:${minutes}`

    return { latitude: lat, longitude: lon, timezone }
  } catch (_error) {
    throw new Error('Failed to fetch location data')
  }
}

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET /api/users/[id] - Get user by ID
export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const snapshot = await db.ref(`users/${id}`).once('value')
    const user = snapshot.val()

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (_error) {
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 })
  }
}

// PUT /api/users/[id] - Update user
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const { name, zipcode } = await request.json()
    const snapshot = await db.ref(`users/${id}`).once('value')
    let user = snapshot.val()

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (name) user.name = name
    if (zipcode) {
      if (zipcode !== user.zipcode) {
        // Re-fetch location data when zipcode changes
        const locationData = await fetchLocationData(zipcode)
        user = { ...user, zipcode, ...locationData }
      } else {
        user.zipcode = zipcode
      }
    }

    await db.ref(`users/${id}`).set(user)
    return NextResponse.json(user)
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}

// DELETE /api/users/[id] - Delete user
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const ref = db.ref(`users/${id}`)
    const snapshot = await ref.once('value')

    if (!snapshot.exists()) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    await ref.remove()
    return new NextResponse(null, { status: 204 })
  } catch (_error) {
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 })
  }
}
