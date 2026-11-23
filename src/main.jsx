import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "bootstrap/dist/css/bootstrap.min.css";
import './index.css'
import App from './App.jsx'
import { ChatProvider } from './context/ChatContext.jsx'
import ChatBox from './components/ChatBox.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ChatProvider>
      <App />
      <ChatBox />
    </ChatProvider>
  </StrictMode>,
)