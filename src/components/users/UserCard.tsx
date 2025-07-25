'use client'

import { Clock, Edit, MapPin, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import type { User } from '@/services/userService'

interface UserCardProps {
  user: User
  onEdit: (user: User) => void
  onDelete: (user: User) => void
}

export function UserCard({ user, onEdit, onDelete }: UserCardProps) {
  return (
    <Card className='w-full hover:shadow-md transition-shadow'>
      <CardHeader className='pb-3'>
        <CardTitle className='text-lg leading-tight break-words'>{user.name}</CardTitle>
        <CardDescription className='text-xs text-muted-foreground truncate'>ID: {user.id}</CardDescription>
      </CardHeader>
      <CardContent className='pb-4'>
        <div className='space-y-2.5'>
          <div className='flex items-center gap-2 text-sm'>
            <MapPin className='h-4 w-4 text-muted-foreground flex-shrink-0' />
            <span className='break-words'>Zip: {user.zipcode}</span>
          </div>
          <div className='flex items-start gap-2 text-sm'>
            <MapPin className='h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5' />
            <div className='min-w-0 flex-1'>
              <div className='break-words'>
                Coordinates: {user.latitude.toFixed(4)}, {user.longitude.toFixed(4)}
              </div>
            </div>
          </div>
          <div className='flex items-center gap-2 text-sm'>
            <Clock className='h-4 w-4 text-muted-foreground flex-shrink-0' />
            <span className='break-words'>Timezone: {user.timezone}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className='flex gap-2 pt-0'>
        <Button variant='outline' size='sm' onClick={() => onEdit(user)} className='flex-1 min-w-0'>
          <Edit className='mr-1 h-4 w-4 flex-shrink-0' />
          <span className='truncate'>Edit</span>
        </Button>
        <Button variant='destructive' size='sm' onClick={() => onDelete(user)} className='flex-1 min-w-0'>
          <Trash2 className='mr-1 h-4 w-4 flex-shrink-0' />
          <span className='truncate'>Delete</span>
        </Button>
      </CardFooter>
    </Card>
  )
}
