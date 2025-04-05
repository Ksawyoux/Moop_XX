import { useState, useEffect } from 'react'
import axios from 'axios'
import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS, registerables } from 'chart.js'

ChartJS.register(...registerables)

export default function Budget() {
  const [goal, setGoal] = useState(0)
  const [currentSpending, setCurrentSpending] = useState(0)
  const [categories, setCategories] = useState([])
  const [newCategory, setNewCategory] = useState('')
  const [newAmount, setNewAmount] = useState(0)

  useEffect(() => {
    fetchBudgetData()
  }, [])

  const fetchBudgetData = async () => {
    try {
      const response = await axios.get('/api/budget')
      setGoal(response.data.goal)
      setCurrentSpending(response.data.currentSpending)
      setCategories(response.data.categories || [])
    } catch (error) {
      console.error('Error fetching budget data:', error)
    }
  }

  const handleSetGoal = async (e) => {
    e.preventDefault()
    try {
      await axios.post('/api/budget/set-goal', { goal })
      alert('Budget goal updated successfully!')
    } catch (error) {
      console.error('Error setting budget goal:', error)
      alert('Failed to update budget goal')
    }
  }

  const handleAddCategory = async (e) => {
    e.preventDefault()
    if (!newCategory || newAmount <= 0) return
    
    try {
      await axios.post('/api/budget/add-category', {
        category: newCategory,
        amount: parseFloat(newAmount)
      })
      setNewCategory('')
      setNewAmount(0)
      fetchBudgetData()
    } catch (error) {
      console.error('Error adding budget category:', error)
      alert('Failed to add budget category')
    }
  }

  const chartData = {
    labels: categories.map(c => c.name),
    datasets: [
      {
        label: 'Budget Allocation',
        data: categories.map(c => c.amount),
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }
    ]
  }

  return (
    <div className="budget-page">
      <h1>Budget Management</h1>
      
      <div className="budget-form">
        <h2>Set Monthly Budget Goal</h2>
        <form onSubmit={handleSetGoal}>
          <label>
            Monthly Budget Goal ($):
            <input 
              type="number" 
              value={goal} 
              onChange={(e) => setGoal(e.target.value)} 
              min="0" 
              step="0.01" 
              required 
            />
          </label>
          <button type="submit">Set Goal</button>
        </form>
      </div>

      <div className="current-status">
        <h3>Current Status</h3>
        <p>Goal: ${goal}</p>
        <p>Current Spending: ${currentSpending}</p>
        <p>Remaining: ${goal - currentSpending}</p>
        <div className="progress-bar">
          <div 
            className="progress" 
            style={{ width: `${Math.min(100, (currentSpending / goal) * 100)}%` }}
          ></div>
        </div>
      </div>

      <div className="category-management">
        <h2>Budget Categories</h2>
        <form onSubmit={handleAddCategory}>
          <label>
            Category Name:
            <input 
              type="text" 
              value={newCategory} 
              onChange={(e) => setNewCategory(e.target.value)} 
              required 
            />
          </label>
          <label>
            Amount ($):
            <input 
              type="number" 
              value={newAmount} 
              onChange={(e) => setNewAmount(e.target.value)} 
              min="0" 
              step="0.01" 
              required 
            />
          </label>
          <button type="submit">Add Category</button>
        </form>

        {categories.length > 0 && (
          <div className="chart-container">
            <Bar data={chartData} />
          </div>
        )}
      </div>
    </div>
  )
}