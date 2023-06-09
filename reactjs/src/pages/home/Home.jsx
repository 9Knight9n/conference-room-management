import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from "react-router-dom";
import Profile from "./components/Profile";
import { Tabs } from 'antd';
import Invoice from "./components/Invoice";
import Admin from "./components/Admin";


function Home (props) {
    // const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const items = [
        ...props.permission['has_access_to_admin_panel']?[{
            key: '1',
            label: 'Admin Panel',
            children: <Admin notif={props.notif} token={props.token}/>,
        }]:[],
        ...props.permission['has_access_to_admin_panel']?[{
            key: '2',
            label: 'Manager Panel',
            children: <Invoice token={props.token}/>,
        }]:[],
        {
            key: '2',
            label: 'Public Panel',
            children: <Invoice token={props.token}/>,
        },
    ];

    // useEffect(() => {
    //     if (!props.token)
    //         navigate("/login")
    // }, [props.token]);


    return (
        <div style={{display:'flex',flexDirection:'column',width:'600px'}}>
            <Profile permission={props.permission} id={props.id} username={props.username} token={props.token}/>
            <Tabs defaultActiveKey="1" items={items}/>
        </div>
    );
};
export default Home;