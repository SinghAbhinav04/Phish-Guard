# Phishing Detection using ML - Web Extension

A comprehensive web extension that leverages machine learning to detect phishing websites in real-time. The system continuously improves its detection capabilities through user feedback and automated retraining.

##  Features

- **Real-time Phishing Detection**: Analyzes URLs instantly using a trained machine learning model
- **User Feedback System**: Collects and verifies user feedback to improve detection accuracy
- **Automatic Model Retraining**: Updates the ML model based on new data and user feedback
- **History Tracking**: Maintains a log of scanned URLs for user reference
- **Responsive UI**: Clean and intuitive interface built with React

##  System Architecture

The application follows a microservices architecture with the following components:

```
┌─────────────────┐        ┌─────────────────┐        ┌─────────────────┐
│                 │        │                 │        │                 │
│  React Frontend │◄─────► │  Node.js API    │◄─────► │  MongoDB        │
│  (Web Extension)│        │  Backend        │        │  Database       │
│                 │        │                 │        │                 │
└─────────────────┘        └────────┬────────┘        └─────────────────┘
                                    │
                                    │
                           ┌────────▼────────┐        ┌─────────────────┐
                           │                 │        │                 │
                           │  Flask ML       │◄─────► │  ML Model &     │
                           │  Backend        │        │  Dataset        │
                           │                 │        │                 │
                           └─────────────────┘        └─────────────────┘
```

##  Detection Flow

1. User submits a URL through the web extension
2. Node.js backend processes the request and checks cache
3. If not cached, the URL is sent to the Flask backend for feature extraction
4. ML model predicts if the URL is safe or phishing
5. Results are stored in MongoDB and returned to the user
6. Users can provide feedback, which triggers verification and model improvement

##  Getting Started

### Prerequisites

- Node.js (v14+)
- Python (v3.8+)
- MongoDB
- Chrome/Firefox for extension installation

### Installation

1. Clone the repository
   ```bash
   # Using SSH
   git clone git@github.com:SinghAbhinav04/Phish-Guard.git

   # Or using Https
   git clone https://github.com/SinghAbhinav04/Phish-Guard.git
   ```

2. Set up and start the Flask backend
   ```bash
   cd flask-backend
   pip install -r requirements.txt
   python app.py
   ```

3. Set up and start the Node.js backend
   ```bash
   cd backend
   npm install
   npm start
   ```

4. Set up and build the frontend
   ```bash
   cd extension-ui
   npm install
   npm run build
   ```

5. Load the extension in your browser
   - Chrome: Go to `chrome://extensions/`, enable Developer mode, and click "Load unpacked"
   - Firefox: Go to `about:debugging#/runtime/this-firefox`, click "Load Temporary Add-on"
   - Select the `frontend/build` directory

##  Documentation

For detailed information about each component:
- [Flask Backend Documentation](./flask-backend/FLASK-README.md)
- [Node.js Backend Documentation](./backend/NODE-README.md)
- [Frontend Documentation](./extension-ui/FRONTEND-README.md)

##  ML Model Performance

The current Random Forest classifier achieves an accuracy of **96%** on the Frontiers URL-based test dataset.

##  Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a pull request

##  License

This project is licensed under the MIT License - see the LICENSE file for details.

##  Acknowledgements

- [Frontiers URL-based Phishing Dataset](https://www.frontiersin.org/journals/computer-science/articles/10.3389/fcomp.2024.1308634/full)
- [scikit-learn](https://scikit-learn.org/)
- [React](https://reactjs.org/)
- [Flask](https://flask.palletsprojects.com/)
- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Google Gemini Api](https://ai.google.dev/gemini-api/docs)
