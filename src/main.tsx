import { createRoot } from 'react-dom/client';
import styles from './tailwind-output.css?inline';
import styles2 from '@uiw/react-markdown-preview/markdown.css?inline';
import App from './App.tsx';

const initialize = () => {
  const script = document.currentScript as HTMLScriptElement
  const assistant_name = script?.getAttribute('data-assistant_name') || ""
  const phone_number = script?.getAttribute('data-phone_number') || ""
  const id = script?.getAttribute('data-id') || ""

  const container = document.createElement('div')
  container.id = 'my-widget-container'
  document.body.appendChild(container)

  const shadow = container.attachShadow({ mode: 'open' })

  const styleElement = document.createElement('style')
  styleElement.textContent = styles + " " + styles2
  shadow.appendChild(styleElement)

  const widgetRoot = document.createElement('div')
  shadow.appendChild(widgetRoot)

  createRoot(widgetRoot).render(
    <App
      id={id}
      phone_number={phone_number}
      assistant_name={assistant_name}
    />
  )
}

if (document.readyState === 'complete' || document.readyState === 'interactive') {
  initialize()
} else {
  document.addEventListener('DOMContentLoaded', initialize)
}



// import { StrictMode } from 'react';
// import { createRoot } from 'react-dom/client';
// import App from './App.tsx';
// import './index.css';

// createRoot(document.getElementById('root')!).render(
//   <StrictMode>
//     <App
//       id=''
//       phone_number=''
//       assistant_name=''
//     />
//   </StrictMode>,
// )
