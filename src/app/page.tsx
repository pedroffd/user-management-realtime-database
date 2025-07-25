import { UserList } from '@/components/users/UserList'

export default function Home() {
  return (
    <div className='container mx-auto px-4 py-6 sm:px-6 sm:py-8 lg:px-8'>
      <UserList />
    </div>
  )
}
