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
import {baseURL} from "./components/config";



function App() {
  const [token, setToken] = useState(null);
  const [id, setId] = useState(null);
  const [username, setUsername] = useState(null);
  const [permission, setPermission] = useState(null);
  const [api, contextHolder] = notification.useNotification();

    // useEffect(() => {
    // }, []);

    function logOut() {
        var myHeaders = new Headers();
        myHeaders.append("authorization", "token " + token);
        var formdata = new FormData();
        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: formdata,
            redirect: 'follow'
        };
        fetch(baseURL + "/api/auth/logout/", requestOptions)
            .then(response => response.text())
            .then(response => {}).catch(error => console.log('error', error));
        setToken(null)
    }

  return (
    <BrowserRouter>
      {contextHolder}
        {token?<div style={{position:'absolute',bottom:'0', margin:'5px'}}><Button danger type="primary" onClick={logOut}>
            Log out
        </Button></div>:""}
      <div className={'center'}>
          <Routes>
              <Route index element={
                  <RequireAuth token={token}>
                      <Home permission={permission} notif={api} token={token} id={id} username={username}/>
                  </RequireAuth>
              }/>
              <Route path="/login" element={<Login notif={api} setPermission={setPermission}
                  setUsername={setUsername} setToken={setToken}
                  setId={setId}/>}
              />
              <Route path="/register" element={<Register notif={api} setToken={setToken}/>}/>
              <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
