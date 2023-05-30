import express from 'express';
import path from 'path';

const app = express();
const port = process.env.PORT || 3000; // Use the port Heroku provides or 3000 locally

// Serve static files from the React app
app.use(express.static(path.join(__dirname, './build')));

// If no explicit route match, send the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/build/index.html'));
});

app.listen(port, () => {
  console.log(`Server is up and running on port ${port}`);
});
