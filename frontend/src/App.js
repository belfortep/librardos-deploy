import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom'
import { ThemeProvider } from './components/ThemeContext/ThemeContext';
import Layout from './Layout';
import { Book } from './pages/book/Book';
import { Books } from './pages/books/Books';
import { Register } from './pages/register/Register';
import { Login } from './pages/login/Login';
import { Favourites } from './pages/favourites/Favourites';
import { CreateCommunities } from './pages/createCommunities/CreateCommunities';
import { Communities } from './pages/communities/Communities';
import { Community } from './pages/community/Community';
import { Users} from './pages/users/Users';
import { Welcome} from './pages/welcome/Welcome';
import { User } from './pages/user/User';
import { Profile } from './pages/profile/Profile';
import { EditProfile } from './pages/editProfile/EditProfile';
import './app.css'
import './styles.css' // Make sure to import the styles for the Navbar and themes
import { Writers } from './pages/writers/Writers';
import PremiumCheckout from './pages/premiumCheckout/PremiumCheckout';
import { RegisterModerator } from './pages/registerModerator/RegisterModerator';


function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path='/' element={<Welcome />}/>
            <Route path='/catalog' element={<Books />} />
            <Route path='/communities' element={<Communities />} />
            <Route path='/community/:id' element={<Community />} />
            <Route path="/create/:id" element={<CreateCommunities/>} />
            <Route path='/register' element={<Register />} />
            <Route path='/registerModerator/:id' element={<RegisterModerator />} />
            <Route path='/login' element={<Login />} />
            <Route path='/:id' element={<Book />} />
            <Route path='/myBooks' element={<Favourites/>}/>
            <Route path="/profile" element={<Profile/>}/>
            <Route path="/edit" element={<EditProfile/>}/>
            <Route path='/users' element={<Users/>}/>
            <Route path='/user/:id' element={<User/>}/>
            <Route path='/writers' element={<Writers/>}/>
            <Route path='/premium' element={<PremiumCheckout/>}/>
          </Routes>
        </Layout>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
