import { useEffect, useState } from 'react'
import { Bar, Pie } from 'react-chartjs-2'
import axios from 'axios'
import { Chart as ChartJS, registerables } from 'chart.js'
import { store } from 'react-notifications-component'

ChartJS.register(...registerables)

export default function Dashboard() {
  const [spendingData, setSpendingData] = useState([])
  const [sentimentData, setSentimentData] = useState([])
  const [budgetGoal, setBudgetGoal] = useState(0)
  const [currentSpending, setCurrentSpending] = useState(0)

  useEffect(() => {
    // Fetch initial data
    fetchSpendingData()
    fetchSentimentData()
    fetchBudgetGoal()

    // Set up periodic notifications
    const notificationInterval = setInterval(() => {
      triggerFeedbackNotification()
    }, 3600000) // Every hour

    return () => clearInterval(notificationInterval)
  }, [])

  const fetchSpendingData = async () => {
    try {
      const response = await axios.get('/api/spending')
      setSpendingData(response.data.spending)
      setCurrentSpending(response.data.total)
    } catch (error) {
      console.error('Error fetching spending data:', error)
    }
  }

  const fetchSentimentData = async () => {
    try {
      const response = await axios.get('/api/sentiment')
      setSentimentData(response.data)
    } catch (error) {
      console.error('Error fetching sentiment data:', error)
    }
  }

  const fetchBudgetGoal = async () => {
    try {
      const response = await axios.get('/api/budget')
      setBudgetGoal(response.data.goal)
    } catch (error) {
      console.error('Error fetching budget goal:', error)
    }
  }

  const triggerFeedbackNotification = () => {
    store.addNotification({
      title: "How are you feeling?",
      message: "Tap to record your current emotional state",
      type: "info",
      insert: "top",
      container: "top-right",
      animationIn: ["animate__animated", "animate__fadeIn"],
      animationOut: ["animate__animated", "animate__fadeOut"],
      dismiss: {
        duration: 10000,
        onScreen: true
      },
      onClick: () => {
        // Open sentiment recording modal
        console.log('User clicked notification')
      }
    })
  }

  const spendingChartData = {
    labels: spendingData.map(item => item.category),
    datasets: [
      {
        label: 'Spending by Category',
        data: spendingData.map(item => item.amount),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }
    ]
  }

  const sentimentChartData = {
    labels: ['Positive', 'Neutral', 'Negative'],
    datasets: [
      {
        data: [
          sentimentData.positive || 0,
          sentimentData.neutral || 0,
          sentimentData.negative || 0
        ],
        backgroundColor: [
          'rgba(75, 192, 192, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(255, 99, 132, 0.5)'
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(255, 99, 132, 1)'
        ],
        borderWidth: 1
      }
    ]
  }

  return (
    <div className="dashboard">
      <h1>Financial Wellness Dashboard</h1>
      
      <div className="budget-summary">
        <h2>Monthly Budget Progress</h2>
        <p>Goal: ${budgetGoal}</p>
        <p>Current Spending: ${currentSpending}</p>
        <p>Remaining: ${budgetGoal - currentSpending}</p>
        <div className="progress-bar">
          <div 
            className="progress" 
            style={{ width: `${Math.min(100, (currentSpending / budgetGoal) * 100)}%` }}
          ></div>
        </div>
      </div>

      <div className="charts-container">
        <div className="chart">
          <h3>Spending by Category</h3>
          <Bar data={spendingChartData} />
        </div>
        
        <div className="chart">
          <h3>Emotional Sentiment</h3>
          <Pie data={sentimentChartData} />
        </div>
      </div>
    </div>
  )
}