import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Web3AuthProvider } from './provider/authProvider.tsx'
import { chainConfig } from './helper/chainConfig.ts'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <Web3AuthProvider chainConfig={chainConfig}>
    <App />
    </Web3AuthProvider>
)
