import './App.css';

import React, {useState} from 'react';
import { BrowserRouter as Router,Routes,Route} from 'react-router-dom';
import Home from './Home';
import SignIn from './SignIn';


function App() {

  const [user, setUser] = useState(null);
  
  return(
    <div className='App'>
    <Router>
      <Routes>
        <Route exact path='/signin' element={<SignIn setUser={setUser}/>}/>
        <Route path='/' element={<Home user={user}/>}/>
      </Routes>
    </Router>
    </div>
  );

}

export default App;
