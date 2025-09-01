import React from 'react'; // Importe la bibliothèque React pour JSX et les composants
import ReactDOM from 'react-dom/client'; // Importe ReactDOM pour interagir avec le DOM du navigateur
import App from './App'; // Importe votre composant principal App
import './index.css'; // Importe les styles globaux (si vous en avez, ex: Tailwind CSS)

// Obtient l'élément DOM où l'application React sera "montée"
// C'est généralement un <div id="root"> dans votre fichier public/index.html
const rootElement = document.getElementById('root');

// Crée une racine de rendu React (méthode moderne pour React 18+)
// et rend le composant App à l'intérieur de cette racine.
// React.StrictMode est un outil de développement pour détecter des problèmes potentiels.
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App /> {/* Votre composant principal App est rendu ici */}
  </React.StrictMode>
);
