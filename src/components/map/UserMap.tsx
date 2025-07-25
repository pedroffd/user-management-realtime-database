'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { MapView } from './MapView'
import type { User } from '@/services/userService'

interface UserMapProps {
  users: User[]
  onUserClick?: (user: User) => void
  className?: string
}

export function UserMap({ users, onUserClick, className }: UserMapProps) {
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const markersRef = useRef<Map<string, google.maps.Marker>>(new Map())
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null)

  // Calculate center based on users
  const center = useCallback(() => {
    if (users.length === 0) {
      return { lat: -23.5505, lng: -46.6333 } // São Paulo default
    }

    const avgLat = users.reduce((sum, user) => sum + user.latitude, 0) / users.length
    const avgLng = users.reduce((sum, user) => sum + user.longitude, 0) / users.length

    return { lat: avgLat, lng: avgLng }
  }, [users])

  // Handle map load
  const handleMapLoad = useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance)
    
    // Create info window
    infoWindowRef.current = new google.maps.InfoWindow()
  }, [])

  // Create or update markers when users change
  useEffect(() => {
    if (!map || !users.length) return

    const currentMarkers = markersRef.current
    const userIds = new Set(users.map(user => user.id))

    // Remove markers for users that no longer exist
    for (const [userId, marker] of currentMarkers.entries()) {
      if (!userIds.has(userId)) {
        marker.setMap(null)
        currentMarkers.delete(userId)
      }
    }

    // Add or update markers for current users
    users.forEach(user => {
      let marker = currentMarkers.get(user.id)

      if (!marker) {
        // Create new marker
        marker = new google.maps.Marker({
          position: { lat: user.latitude, lng: user.longitude },
          map,
          title: user.name,
          icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#3B82F6"/>
              </svg>
            `),
            scaledSize: new google.maps.Size(24, 24),
            anchor: new google.maps.Point(12, 24),
          },
        })

        // Add click listener
        marker.addListener('click', () => {
          if (infoWindowRef.current) {
            const content = `
              <div style="padding: 8px; font-family: system-ui, -apple-system, sans-serif;">
                <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #1f2937;">
                  ${user.name}
                </h3>
                <div style="font-size: 14px; color: #6b7280; line-height: 1.4;">
                  <p style="margin: 4px 0;"><strong>Zipcode:</strong> ${user.zipcode}</p>
                  <p style="margin: 4px 0;"><strong>Location:</strong> ${user.latitude.toFixed(4)}, ${user.longitude.toFixed(4)}</p>
                  <p style="margin: 4px 0;"><strong>Timezone:</strong> ${user.timezone}</p>
                </div>
              </div>
            `
            
            infoWindowRef.current.setContent(content)
            infoWindowRef.current.open(map, marker)
          }

          if (onUserClick) {
            onUserClick(user)
          }
        })

        currentMarkers.set(user.id, marker)
      } else {
        // Update existing marker position if needed
        const currentPos = marker.getPosition()
        if (
          !currentPos ||
          currentPos.lat() !== user.latitude ||
          currentPos.lng() !== user.longitude
        ) {
          marker.setPosition({ lat: user.latitude, lng: user.longitude })
        }
      }
    })

    // Fit map bounds to show all markers
    if (users.length > 1) {
      const bounds = new google.maps.LatLngBounds()
      users.forEach(user => {
        bounds.extend({ lat: user.latitude, lng: user.longitude })
      })
      map.fitBounds(bounds)
      
      // Add padding
      const padding = { top: 50, right: 50, bottom: 50, left: 50 }
      map.fitBounds(bounds, padding)
    }
  }, [map, users, onUserClick])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      markersRef.current.forEach(marker => marker.setMap(null))
      markersRef.current.clear()
    }
  }, [])

  return (
    <MapView
      center={center()}
      zoom={users.length === 1 ? 12 : 6}
      onMapLoad={handleMapLoad}
      className={className || 'w-full h-[600px] rounded-lg border'}
    />
  )
} 