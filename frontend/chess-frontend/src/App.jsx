import './App.css';
import NavBar from './Components/NavBar';
import {
  Outlet
} from "react-router-dom";

function App() {
  return (
    <>
    <div>
    <NavBar />
     <div className='nav-links-elaborator'>
       <Outlet />
     </div>
    </div>
    </>
  );
}

export default App;
