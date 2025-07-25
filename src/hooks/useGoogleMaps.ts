'use client'

import { type Library, Loader } from '@googlemaps/js-api-loader'
import { useEffect, useState } from 'react'

interface UseGoogleMapsOptions {
  libraries?: Library[]
}

export function useGoogleMaps(options: UseGoogleMapsOptions = {}) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

    if (!apiKey) {
      setLoadError('Google Maps API key not configured')
      return
    }

    const loader = new Loader({
      apiKey,
      version: 'weekly',
      libraries: options.libraries || ['maps' as Library, 'marker' as Library],
    })

    loader
      .load()
      .then(() => {
        setIsLoaded(true)
        setLoadError(null)
      })
      .catch((error) => {
        console.error('Failed to load Google Maps:', error)
        setLoadError('Failed to load Google Maps')
        setIsLoaded(false)
      })
  }, [options.libraries])

  return { isLoaded, loadError }
}
