'use client'

import { Clock, Edit, MapPin, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { User } from '@/services/userService'

interface UserTableProps {
  users: User[]
  onEdit: (user: User) => void
  onDelete: (user: User) => void
}

export function UserTable({ users, onEdit, onDelete }: UserTableProps) {
  return (
    <div className='rounded-md border overflow-hidden'>
      <div className='overflow-x-auto'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='min-w-[120px]'>Name</TableHead>
              <TableHead className='min-w-[80px]'>Zip Code</TableHead>
              <TableHead className='min-w-[140px] hidden sm:table-cell'>
                <div className='flex items-center gap-1'>
                  <MapPin className='h-4 w-4' />
                  <span className='hidden md:inline'>Coordinates</span>
                  <span className='md:hidden'>Coords</span>
                </div>
              </TableHead>
              <TableHead className='min-w-[100px] hidden md:table-cell'>
                <div className='flex items-center gap-1'>
                  <Clock className='h-4 w-4' />
                  Timezone
                </div>
              </TableHead>
              <TableHead className='w-[100px] sm:w-[120px]'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className='text-center text-muted-foreground py-8'>
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className='font-medium'>
                    <div className='min-w-0'>
                      <div className='truncate'>{user.name}</div>
                      {/* Show extra info on mobile */}
                      <div className='text-xs text-muted-foreground sm:hidden mt-1'>
                        {user.zipcode} • {user.timezone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className='text-center'>{user.zipcode}</TableCell>
                  <TableCell className='hidden sm:table-cell text-sm'>
                    <div className='font-mono'>
                      {user.latitude.toFixed(4)}, {user.longitude.toFixed(4)}
                    </div>
                  </TableCell>
                  <TableCell className='hidden md:table-cell text-sm'>{user.timezone}</TableCell>
                  <TableCell>
                    <div className='flex gap-1 sm:gap-2'>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => onEdit(user)}
                        className='h-7 w-7 p-0 sm:h-8 sm:w-8'
                        title='Edit user'
                      >
                        <Edit className='h-3 w-3 sm:h-4 sm:w-4' />
                      </Button>
                      <Button
                        variant='destructive'
                        size='sm'
                        onClick={() => onDelete(user)}
                        className='h-7 w-7 p-0 sm:h-8 sm:w-8'
                        title='Delete user'
                      >
                        <Trash2 className='h-3 w-3 sm:h-4 sm:w-4' />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
