'use client'

import { useEffect, useRef } from 'react'
import { useGoogleMaps } from '@/hooks/useGoogleMaps'

interface MapViewProps {
  center?: { lat: number; lng: number }
  zoom?: number
  className?: string
  onMapLoad?: (map: google.maps.Map) => void
}

export function MapView({
  center = { lat: -23.5505, lng: -46.6333 }, // São Paulo default
  zoom = 10,
  className = 'w-full h-96',
  onMapLoad,
}: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<google.maps.Map | null>(null)
  const { isLoaded, loadError } = useGoogleMaps()

  useEffect(() => {
    if (!isLoaded || !mapRef.current || mapInstanceRef.current) return

    const mapOptions: google.maps.MapOptions = {
      center,
      zoom,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      zoomControl: true,
      streetViewControl: false,
      fullscreenControl: true,
      mapTypeControl: false,
    }

    const map = new google.maps.Map(mapRef.current, mapOptions)
    mapInstanceRef.current = map

    if (onMapLoad) {
      onMapLoad(map)
    }
  }, [isLoaded, center, zoom, onMapLoad])

  if (loadError) {
    return (
      <div className={`${className} flex items-center justify-center bg-muted rounded-lg`}>
        <div className='text-center space-y-2'>
          <p className='text-muted-foreground'>Failed to load map</p>
          <p className='text-sm text-destructive'>{loadError}</p>
        </div>
      </div>
    )
  }

  if (!isLoaded) {
    return (
      <div className={`${className} flex items-center justify-center bg-muted rounded-lg animate-pulse`}>
        <p className='text-muted-foreground'>Loading map...</p>
      </div>
    )
  }

  return <div ref={mapRef} className={className} />
}
