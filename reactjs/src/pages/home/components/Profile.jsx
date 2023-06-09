import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { Descriptions, Space, Button, InputNumber  } from 'antd';
import {baseURL} from "../../../components/config";


function Profile (props) {
    const [loading, setLoading] = useState(false);
    // const navigate = useNavigate();

    useEffect(() => {
    }, []);


    return (
        <>
            <Descriptions column={3} title="User Info">
                <Descriptions.Item label="Username" span={2}>{props.username}</Descriptions.Item>
                <Descriptions.Item label="Permission">{props.permission['type']}</Descriptions.Item>
                <Descriptions.Item label="ID" span={2}>{props.id}</Descriptions.Item>
            </Descriptions>
        </>
    );
};
export default Profile;