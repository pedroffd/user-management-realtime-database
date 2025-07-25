'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Grid3x3, Map as MapIcon, Plus, Table2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { type CreateUserData, type UpdateUserData, type User, userService } from '@/services/userService'
import { UserMap } from '../map/UserMap'
import { UserCard } from './UserCard'
import { UserForm } from './UserForm'
import { UserTable } from './UserTable'

type ViewMode = 'cards' | 'table' | 'map'

export function UserList() {
  const [viewMode, setViewMode] = useState<ViewMode>('cards')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | undefined>()
  const [deletingUser, setDeletingUser] = useState<User | undefined>()
  const queryClient = useQueryClient()

  const {
    data: users = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['users'],
    queryFn: userService.getUsers,
  })

  const createMutation = useMutation({
    mutationFn: userService.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success('User created successfully')
      setIsFormOpen(false)
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to create user')
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserData }) => userService.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success('User updated successfully')
      setEditingUser(undefined)
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to update user')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: userService.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success('User deleted successfully')
      setDeletingUser(undefined)
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to delete user')
    },
  })

  const handleCreate = async (data: CreateUserData) => {
    await createMutation.mutateAsync(data)
  }

  const handleUpdate = async (data: UpdateUserData) => {
    if (editingUser) {
      await updateMutation.mutateAsync({ id: editingUser.id, data })
    }
  }

  const handleDelete = async () => {
    if (deletingUser) {
      await deleteMutation.mutateAsync(deletingUser.id)
    }
  }

  const handleEdit = (user: User) => {
    setEditingUser(user)
  }

  const handleDeleteClick = (user: User) => {
    setDeletingUser(user)
  }

  if (error) {
    return (
      <div className='flex flex-col items-center justify-center min-h-[400px] space-y-4'>
        <p className='text-destructive'>Failed to load users</p>
        <Button onClick={() => queryClient.invalidateQueries({ queryKey: ['users'] })}>Try Again</Button>
      </div>
    )
  }

  return (
    <div className='space-y-4 sm:space-y-6'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h1 className='text-2xl font-bold sm:text-3xl'>User Management</h1>
          <p className='text-muted-foreground'>Manage users with location data</p>
        </div>
        <div className='flex items-center gap-2 sm:gap-3'>
          {/* Theme Toggle */}
          <ThemeToggle />
          {/* View Toggle */}
          <div className='flex rounded-md border'>
            <Button
              variant={viewMode === 'cards' ? 'default' : 'ghost'}
              size='sm'
              onClick={() => setViewMode('cards')}
              className='rounded-r-none px-2 sm:px-3'
            >
              <Grid3x3 className='h-4 w-4' />
              <span className='ml-1 hidden sm:inline'>Cards</span>
            </Button>
            <Button
              variant={viewMode === 'table' ? 'default' : 'ghost'}
              size='sm'
              onClick={() => setViewMode('table')}
              className='rounded-none px-2 sm:px-3'
            >
              <Table2 className='h-4 w-4' />
              <span className='ml-1 hidden sm:inline'>Table</span>
            </Button>
            <Button
              variant={viewMode === 'map' ? 'default' : 'ghost'}
              size='sm'
              onClick={() => setViewMode('map')}
              className='rounded-l-none px-2 sm:px-3'
            >
              <MapIcon className='h-4 w-4' />
              <span className='ml-1 hidden sm:inline'>Map</span>
            </Button>
          </div>
          {/* Add User Button */}
          <Button onClick={() => setIsFormOpen(true)} className='flex-shrink-0'>
            <Plus className='mr-2 h-4 w-4' />
            <span className='hidden sm:inline'>Add User</span>
            <span className='sm:hidden'>Add</span>
          </Button>
        </div>
      </div>

      {isLoading ? (
        viewMode === 'cards' ? (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6'>
            {Array.from({ length: 6 }, (_, i) => i).map((index) => (
              <div key={`skeleton-${index}`} className='h-48 bg-muted animate-pulse rounded-lg' />
            ))}
          </div>
        ) : (
          <div className='rounded-md border'>
            <div className='h-48 bg-muted animate-pulse' />
          </div>
        )
      ) : users.length === 0 ? (
        <div className='flex flex-col items-center justify-center min-h-[400px] space-y-4'>
          <p className='text-muted-foreground'>No users found</p>
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className='mr-2 h-4 w-4' />
            Create your first user
          </Button>
        </div>
      ) : viewMode === 'cards' ? (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6'>
          {users.map((user) => (
            <UserCard key={user.id} user={user} onEdit={handleEdit} onDelete={handleDeleteClick} />
          ))}
        </div>
      ) : viewMode === 'table' ? (
        <UserTable users={users} onEdit={handleEdit} onDelete={handleDeleteClick} />
      ) : (
        <UserMap users={users} onUserClick={handleEdit} />
      )}

      <UserForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleCreate}
        isLoading={createMutation.isPending}
      />

      <UserForm
        user={editingUser}
        isOpen={!!editingUser}
        onClose={() => setEditingUser(undefined)}
        onSubmit={handleUpdate}
        isLoading={updateMutation.isPending}
      />

      <Dialog open={!!deletingUser} onOpenChange={() => setDeletingUser(undefined)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {deletingUser?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant='outline' onClick={() => setDeletingUser(undefined)} disabled={deleteMutation.isPending}>
              Cancel
            </Button>
            <Button variant='destructive' onClick={handleDelete} disabled={deleteMutation.isPending}>
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
