import './App.css';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DrawingPage from "./components/DrawingPage/DrawingPage";
import Chat from "./components/Chat/Chat";
import Room from "./pages/Room/Room";

function App() {
  return (
    <div className="App">
      <Room/>
      

    </div>
  );
}

export default App;
