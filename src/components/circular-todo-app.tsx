'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Trash2, HelpCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

interface Todo {
  id: number
  text: string
  status: 'not-started' | 'in-progress' | 'completed'
}

const statusColors = {
  'not-started': 'bg-gray-400',
  'in-progress': 'bg-yellow-500',
  'completed': 'bg-green-500',
}

export function CircularTodoAppComponent() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState('')
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null)

  const addTodo = () => {
    if (newTodo.trim() !== '') {
      setTodos([...todos, { id: Date.now(), text: newTodo, status: 'not-started' }])
      setNewTodo('')
    }
  }

  const updateTodoStatus = (id: number, status: Todo['status']) => {
    setTodos(todos.map(todo => todo.id === id ? { ...todo, status } : todo))
    if (selectedTodo && selectedTodo.id === id) {
      setSelectedTodo({ ...selectedTodo, status })
    }
  }

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id))
    if (selectedTodo && selectedTodo.id === id) {
      setSelectedTodo(null)
    }
  }

  const completedPercentage = (todos.filter(todo => todo.status === 'completed').length / todos.length) * 100 || 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 flex flex-col items-center justify-center p-4">
      <div className="bg-white bg-opacity-20 backdrop-blur-lg rounded-3xl p-8 w-full max-w-md">
        <h1 className="text-4xl font-bold text-white mb-6 text-center">Todas las Notas gg</h1>
        
        <div className="flex mb-4">
          <Input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a new task..."
            className="flex-grow mr-2"
          />
          <Button onClick={addTodo} size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </div>


        <div className="flex justify-between items-center mb-4">
          <div className='w-full flex items-center gap-8'>
          <text x="50" y="50" textAnchor="middle" dominantBaseline="central" fill="white" fontSize="10">
              {selectedTodo ? (todos.findIndex(t => t.id === selectedTodo.id) + 1) : Math.round(completedPercentage) + '%'}
            </text>
          <Progress value={completedPercentage} className="w-3/4" />
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon">
                <HelpCircle className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <div className="space-y-2">
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded-full ${statusColors['not-started']} mr-2`}></div>
                  <span>Not Started</span>
                </div>
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded-full ${statusColors['in-progress']} mr-2`}></div>
                  <span>In Progress</span>
                </div>
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded-full ${statusColors['completed']} mr-2`}></div>
                  <span>Completed</span>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          {todos.map((todo, index) => (
            <motion.div
              key={todo.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex items-center justify-between p-2 rounded-lg ${statusColors[todo.status]}`}
            >
              <span className="flex-grow">{index + 1}. {todo.text}</span>
              <div className="flex space-x-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      Status
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => updateTodoStatus(todo.id, 'not-started')}>
                      Not Started
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => updateTodoStatus(todo.id, 'in-progress')}>
                      In Progress
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => updateTodoStatus(todo.id, 'completed')}>
                      Completed
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button onClick={() => deleteTodo(todo.id)} size="icon" variant="ghost">
                  <Trash2 className="h-4 w-4 text-white" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}