import './App.css';

import { Route, Routes } from "react-router-dom";
import Homepage from "./Pages/Homepage";
import Chatpage from "./Pages/Chatpage";

function App() {

  // const fechData = () => {

  // }

  return (
    <div className='App'>
    <Routes>
      <Route exact path="/" Component={Homepage}/>
      <Route exact path="/chats" Component={Chatpage}/>
      </Routes>
    </div>
  );
}

export default App;
