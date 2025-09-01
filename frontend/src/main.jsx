import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { store } from './features/store.js'
import { Provider } from 'react-redux'
import { SocketContextProvider } from './contexts/Socket.jsx'

createRoot(document.getElementById('root')).render(
    <Provider store={store}>
      <SocketContextProvider>
        <App />
      </SocketContextProvider>
    </Provider>
)
