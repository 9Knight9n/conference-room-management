import { BrowserRouter,Routes, Route, Navigate } from "react-router-dom";
import { notification, Button } from 'antd';
import {useState,useEffect} from 'react'

// css
import './App.css';

// views
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import RequireAuth from './components/RequireAuth'
import Home from "./pages/home/Home";



function App() {
  const [token, setToken] = useState(null);
  const [id, setId] = useState(null);
  const [username, setUsername] = useState(null);
  const [credit, setCredit] = useState(0);
  const [api, contextHolder] = notification.useNotification();

    // useEffect(() => {
    // }, []);

  return (
    <BrowserRouter>
      {contextHolder}
        {token?<div style={{position:'absolute',bottom:'0', margin:'5px'}}><Button danger type="primary" onClick={() => {setToken(null)}}>
            Log out
        </Button></div>:""}
      <div className={'center'}>
          <Routes>
              <Route index element={
                  <RequireAuth token={token}>
                      <Home notif={api} token={token} id={id} username={username} credit={credit}/>
                  </RequireAuth>
              }/>
              <Route path="/login" element={<Login notif={api}
                  setUsername={setUsername} setToken={setToken}
                  setId={setId} setCredit={setCredit}/>}
              />
              <Route path="/register" element={<Register notif={api} setToken={setToken}/>}/>
              <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
