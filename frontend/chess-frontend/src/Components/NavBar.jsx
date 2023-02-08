import './NavBar.css'
import { useRef } from 'react';
import { Link } from 'react-router-dom';


function NavBar() {

const navBarLinks = useRef(null);

function toggleNavBar()
{
  navBarLinks.current.classList.toggle('active');
}
 
  return (
    <nav className="navbar">
      <div className="brand-title">
      <Link to={"/"}>CHESS</Link>
      </div>
      <a href="#" className="toggle-button"  onClick={()=>toggleNavBar()}>
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </a>
      <div className="navbar-links" ref={navBarLinks}>
        <ul>
          {/* <li><Link to={"signup"}>Sign Up</Link></li> */}
          {/* <li><Link to={"login"}>Log In</Link></li> */}
          <li className='playbutton' ><Link to={"playasguest"}>PLAY</Link></li>
        </ul>
      </div>
    </nav>
  );
}

export default NavBar;