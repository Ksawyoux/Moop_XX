from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime
import random

app = Flask(__name__)
CORS(app)

# Mock database for demonstration
budget_data = {
    'goal': 2000,
    'currentSpending': 0,
    'categories': [
        {'name': 'Groceries', 'amount': 500},
        {'name': 'Entertainment', 'amount': 300},
        {'name': 'Utilities', 'amount': 400}
    ]
}

spending_data = {
    'total': 1200,
    'spending': [
        {'category': 'Groceries', 'amount': 400},
        {'category': 'Entertainment', 'amount': 200},
        {'category': 'Utilities', 'amount': 300},
        {'category': 'Dining', 'amount': 300}
    ]
}

sentiment_data = {
    'positive': 0,
    'neutral': 0,
    'negative': 0
}

notifications = []

@app.route('/api/budget', methods=['GET'])
def get_budget():
    return jsonify(budget_data)

@app.route('/api/budget/set-goal', methods=['POST'])
def set_budget_goal():
    data = request.get_json()
    budget_data['goal'] = float(data['goal'])
    return jsonify({'success': True})

@app.route('/api/budget/add-category', methods=['POST'])
def add_budget_category():
    data = request.get_json()
    budget_data['categories'].append({
        'name': data['category'],
        'amount': float(data['amount'])
    })
    return jsonify({'success': True})

@app.route('/api/spending', methods=['GET'])
def get_spending():
    return jsonify(spending_data)

@app.route('/api/sentiment', methods=['GET'])
def get_sentiment():
    return jsonify(sentiment_data)

@app.route('/api/sentiment', methods=['POST'])
def record_sentiment():
    data = request.get_json()
    sentiment = data['sentiment']
    sentiment_data[sentiment] += 1
    
    # Store feedback if provided
    if data.get('feedback'):
        notifications.append({
            'message': f"Sentiment recorded: {sentiment} - {data['feedback']}",
            'timestamp': datetime.now().isoformat()
        })
    
    return jsonify({'success': True})

@app.route('/api/notifications', methods=['GET'])
def get_notifications():
    return jsonify(notifications)

if __name__ == '__main__':
    app.run(port=5000)