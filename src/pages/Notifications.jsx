import { useState, useEffect } from 'react'
import axios from 'axios'
import { store } from 'react-notifications-component'

export default function Notifications() {
  const [notifications, setNotifications] = useState([])
  const [currentSentiment, setCurrentSentiment] = useState('neutral')
  const [feedback, setFeedback] = useState('')

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      const response = await axios.get('/api/notifications')
      setNotifications(response.data)
    } catch (error) {
      console.error('Error fetching notifications:', error)
    }
  }

  const handleSentimentSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post('/api/sentiment', {
        sentiment: currentSentiment,
        feedback
      })
      
      store.addNotification({
        title: "Thank you!",
        message: "Your feedback has been recorded",
        type: "success",
        insert: "top",
        container: "top-right",
        animationIn: ["animate__animated", "animate__fadeIn"],
        animationOut: ["animate__animated", "animate__fadeOut"],
        dismiss: {
          duration: 5000,
          onScreen: true
        }
      })
      
      setCurrentSentiment('neutral')
      setFeedback('')
    } catch (error) {
      console.error('Error submitting sentiment:', error)
    }
  }

  return (
    <div className="notifications-page">
      <h1>Notifications & Feedback</h1>
      
      <div className="sentiment-form">
        <h2>Record Your Current Sentiment</h2>
        <form onSubmit={handleSentimentSubmit}>
          <div className="sentiment-options">
            <label>
              <input 
                type="radio" 
                name="sentiment" 
                value="positive" 
                checked={currentSentiment === 'positive'}
                onChange={() => setCurrentSentiment('positive')}
              />
              Positive
            </label>
            <label>
              <input 
                type="radio" 
                name="sentiment" 
                value="neutral" 
                checked={currentSentiment === 'neutral'}
                onChange={() => setCurrentSentiment('neutral')}
              />
              Neutral
            </label>
            <label>
              <input 
                type="radio" 
                name="sentiment" 
                value="negative" 
                checked={currentSentiment === 'negative'}
                onChange={() => setCurrentSentiment('negative')}
              />
              Negative
            </label>
          </div>
          
          <label>
            Additional Feedback (optional):
            <textarea 
              value={feedback} 
              onChange={(e) => setFeedback(e.target.value)} 
              placeholder="How are you feeling about your finances today?"
            />
          </label>
          
          <button type="submit">Submit</button>
        </form>
      </div>

      <div className="notification-history">
        <h2>Previous Notifications</h2>
        {notifications.length > 0 ? (
          <ul>
            {notifications.map((notification, index) => (
              <li key={index}>
                <p>{notification.message}</p>
                <small>{new Date(notification.timestamp).toLocaleString()}</small>
              </li>
            ))}
          </ul>
        ) : (
          <p>No notifications yet</p>
        )}
      </div>
    </div>
  )
}