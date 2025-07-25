import axios from 'axios'
import { type NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'

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

  if (!apiKey) {
    throw new Error('OpenWeather API key not configured')
  }

  // Try different zipcode formats for better compatibility
  const urls = [
    `https://api.openweathermap.org/data/2.5/weather?zip=${zipcode},BR&appid=${apiKey}`, // Brazilian format
    `https://api.openweathermap.org/data/2.5/weather?zip=${zipcode},US&appid=${apiKey}`, // US format
    `https://api.openweathermap.org/data/2.5/weather?zip=${zipcode}&appid=${apiKey}`, // Default format
  ]

  for (const url of urls) {
    try {
      console.log('Trying OpenWeather URL:', url.replace(apiKey, 'HIDDEN'))
      const response = await axios.get(url)
      console.log('OpenWeather response:', response.data)

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
    } catch (error) {
      console.log('Failed with URL:', url.replace(apiKey, 'HIDDEN'))
      if (axios.isAxiosError(error)) {
        console.log('Error status:', error.response?.status)
        console.log('Error data:', error.response?.data)
      }
      // Continue to next URL format
    }
  }

  throw new Error(`Failed to fetch location data for zipcode: ${zipcode}`)
}

// GET /api/users - Get all users
export async function GET() {
  try {
    const snapshot = await db.ref('users').once('value')
    const users = snapshot.val() || {}
    return NextResponse.json(Object.values(users))
  } catch (_error) {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
  }
}

// POST /api/users - Create new user
export async function POST(request: NextRequest) {
  try {
    console.log('POST /api/users - Request received')
    const body = await request.json()
    console.log('Request body:', body)

    const { name, zipcode } = body

    if (!name || !zipcode) {
      console.log('Missing required fields:', { name, zipcode })
      return NextResponse.json({ error: 'Name and zipcode are required' }, { status: 400 })
    }

    console.log('Fetching location data for zipcode:', zipcode)
    const locationData = await fetchLocationData(zipcode)
    console.log('Location data received:', locationData)

    const id = uuidv4()
    const user = { id, name, zipcode, ...locationData }
    console.log('Creating user:', user)

    await db.ref(`users/${id}`).set(user)
    console.log('User saved to Firebase successfully')

    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/users:', error)
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}
