import {BrowserRouter,Routes,Route,Navigate} from "react-router-dom";

import Dashboard from "./components/Dashboard/Dashboard";
import Tasks from "./components/Tasks/Tasks";
import Projects from "./components/Projects/Projects";
import ProjectDetails from "./components/ProjectDetails/ProjectDetails";
import Login from "./components/Login/Login";
import Signup from "./components/Signup/Signup";
import ProtectedRoute from "./utils/ProtectedRoute";
import Home from "./components/Home/Home";

function App(){
 const token = localStorage.getItem("token");

 return(
  <BrowserRouter>
   <Routes>

    {/* 🔥 HOME FIX */}
    <Route path="/" element={<Home />} />


    <Route path="/login" element={<Login/>}/>
    <Route path="/signup" element={<Signup/>}/>

    <Route path="/dashboard" element={<ProtectedRoute><Dashboard/></ProtectedRoute>}/>
    <Route path="/tasks" element={<ProtectedRoute><Tasks/></ProtectedRoute>}/>
    <Route path="/projects" element={<ProtectedRoute><Projects/></ProtectedRoute>}/>
    <Route path="/project/:id" element={<ProtectedRoute><ProjectDetails/></ProtectedRoute>}/>

   </Routes>
  </BrowserRouter>
 );
}

export default App;