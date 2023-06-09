import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from "react-router-dom";
import Profile from "./components/Profile";
import { Tabs } from 'antd';
import Admin from "./components/Admin";
import Manager from "./components/Manager";
import Public from "./components/Public";


function Home (props) {
    // const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const items = [
        ...props.permission['has_access_to_admin_panel']?[{
            key: '1',
            label: 'Admin Panel',
            children: <Admin notif={props.notif} token={props.token}/>,
        }]:[],
        ...props.permission['has_access_to_crm_panel']?[{
            key: '2',
            label: 'Manager Panel',
            children: <Manager token={props.token} notif={props.notif}/>,
        }]:[],
        {
            key: '3',
            label: 'Public Panel',
            children: <Public token={props.token} notif={props.notif}/>,
        },
    ];

    // useEffect(() => {
    //     if (!props.token)
    //         navigate("/login")
    // }, [props.token]);


    return (
        <div style={{display:'flex',flexDirection:'column',width:'1400px'}}>
            <Profile permission={props.permission} id={props.id} username={props.username} token={props.token}/>
            <Tabs defaultActiveKey="1" items={items}/>
        </div>
    );
};
export default Home;