import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import Home from "./pages/Home";
import Training from "./pages/Training";
import Days from "./pages/Days";
import Profile from "./pages/Profile";

import BottomNav from "./components/BottomNav";


export default function App() {

  return (

    <BrowserRouter>

      <div className="
        min-h-screen
        w-full
        bg-slate-950
        flex
        justify-center
      ">


        <div className="
          w-full
          max-w-md
          min-h-screen
          text-white
        ">


          <div className="pb-24">


            <Routes>

              <Route 
                path="/" 
                element={<Home />} 
              />


              <Route 
                path="/training" 
                element={<Training />} 
              />


              <Route 
                path="/days" 
                element={<Days />} 
              />


              <Route 
                path="/profile" 
                element={<Profile />} 
              />


            </Routes>


          </div>


          <BottomNav />


        </div>


      </div>


    </BrowserRouter>

  );

}