const express = require('express');
const bodyParser = require('body-parser');
const cron = require('node-cron');
const { WebSocketServer } = require('ws');

const app = express();
app.use(bodyParser.json());

let habits = []; // In-memory habit storage
let weeklyLogs = {}; // Logs for weekly reports

// Utility function to get the current date in YYYY-MM-DD format
const getCurrentDate = () => new Date().toISOString().split('T')[0];

// Add a new habit
app.post('/habits', (req, res) => {
    const { name, dailyGoal } = req.body;

    if (!name || !dailyGoal || typeof dailyGoal !== 'number' || dailyGoal <= 0) {
        return res.status(400).json({ status: 'error', error: 'Invalid input' });
    }

    const habit = {
        id: habits.length + 1,
        name,
        dailyGoal,
        progress: {}, // Tracks completion by date
    };

    habits.push(habit);
    res.json({ status: 'success', data: habit });
});

// Mark a habit as complete for a day
app.put('/habits/:id', (req, res) => {
    const habitId = parseInt(req.params.id);
    const habit = habits.find(h => h.id === habitId);

    if (!habit) {
        return res.status(404).json({ status: 'error', error: 'Habit not found' });
    }

    const today = getCurrentDate();
    habit.progress[today] = (habit.progress[today] || 0) + 1;

    if (habit.progress[today] > habit.dailyGoal) {
        habit.progress[today] = habit.dailyGoal; // Ensure progress doesn't exceed goal
    }

    res.json({ status: 'success', data: habit });
});

// Fetch all habits
app.get('/habits', (req, res) => {
    res.json({ status: 'success', data: habits });
});

// Generate a weekly progress report
app.get('/habits/report', (req, res) => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);

    const report = habits.map(habit => {
        const weeklyData = Object.keys(habit.progress)
            .filter(date => new Date(date) >= startDate)
            .reduce((acc, date) => {
                acc[date] = habit.progress[date];
                return acc;
            }, {});

        return {
            id: habit.id,
            name: habit.name,
            weeklyData,
        };
    });

    // Optionally save report to weeklyLogs
    weeklyLogs[getCurrentDate()] = report;

    res.json({ status: 'success', data: report });
});

// WebSocket for daily reminders
const wss = new WebSocketServer({ port: 8080 });

cron.schedule('0 9 * * *', () => { // Daily reminders at 9 AM
    wss.clients.forEach(client => {
        if (client.readyState === client.OPEN) {
            client.send('Reminder: Don’t forget to complete your habits today!');
        }
    });
});

app.listen(3000, () => console.log('Server running on port 3000'));
