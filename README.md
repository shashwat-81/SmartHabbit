Smart Habit Tracker Backend
A Node.js backend to manage and track daily habits with features like habit creation, progress updates, weekly reports, and daily reminders.

Steps to Set Up and Run
Clone the Repository

bash
Copy code
git clone <repository-url>
cd smart-habit-tracker
Install Dependencies

bash
Copy code
npm install
Start the Server

bash
Copy code
node index.js
The server will run on http://localhost:3000.

Test the Endpoints Use Postman or cURL to interact with the API.

API Endpoints
1. Add a New Habit
URL: POST /habits
Body (JSON):
json
Copy code
{
  "name": "Habit Name",
  "dailyGoal": 1
}
Response: Returns the created habit.
2. Update a Habit
URL: PUT /habits/:id
Replace :id with the habit ID.
Description: Marks a habit as complete for the current day.
3. Get All Habits
URL: GET /habits
Response: Returns a list of all active habits with progress.
4. Generate a Weekly Report
URL: GET /habits/report
Response: Provides a weekly progress report for all habits.
Daily Reminders
WebSocket reminders are sent daily at 9 AM.
Connect to ws://localhost:8080 to receive reminders.
Development Notes
Ensure Node.js is installed on your system.
Use tools like Postman or cURL for testing.
To run the server with live reload during development:
bash
Copy code
npm install nodemon --save-dev
npx nodemon index.js
Feel free to adjust this based on your project structure or additional features. Let me know if you need further refinements!










