import axios from 'axios'

// Configure axios defaults
axios.defaults.headers.common['Content-Type'] = 'application/json'

const API_URL = '/api'

export interface User {
  id: string
  name: string
  zipcode: string
  latitude: number
  longitude: number
  timezone: string
}

export interface CreateUserData {
  name: string
  zipcode: string
}

export interface UpdateUserData {
  name?: string
  zipcode?: string
}

export const userService = {
  async getUsers(): Promise<User[]> {
    const response = await axios.get(`${API_URL}/users`)
    return response.data
  },

  async getUserById(id: string): Promise<User> {
    const response = await axios.get(`${API_URL}/users/${id}`)
    return response.data
  },

  async createUser(data: CreateUserData): Promise<User> {
    try {
      console.log('Creating user with data:', data)
      const response = await axios.post(`${API_URL}/users`, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      console.log('User created successfully:', response.data)
      return response.data
    } catch (error) {
      console.error('Error creating user:', error)
      if (axios.isAxiosError(error)) {
        console.error('Response data:', error.response?.data)
        console.error('Response status:', error.response?.status)
      }
      throw error
    }
  },

  async updateUser(id: string, data: UpdateUserData): Promise<User> {
    const response = await axios.put(`${API_URL}/users/${id}`, data)
    return response.data
  },

  async deleteUser(id: string): Promise<void> {
    await axios.delete(`${API_URL}/users/${id}`)
  },
}
