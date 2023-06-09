import React, {useState} from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input } from 'antd';
import { useNavigate, Link } from "react-router-dom";
import {baseURL} from "../../components/config";


function Login (props) {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const onFinish = async (values) => {
        setLoading(true)
        var formdata = new FormData();
        formdata.append("username", values['username']);
        formdata.append("password", values['password']);

        var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow'
        };

        await fetch(baseURL + '/api/auth/login/', requestOptions)
            .then(async response => {
                let temp = JSON.parse(await response.text());

                if (response.status !== 200) {
                    for (const [key, value] of Object.entries(temp)) {
                        props.notif.error({
                            message: 'error (' + key + ")",
                            description: value,
                            placement: 'top',
                        });
                    }
                }
                else {
                    props.setToken(temp.token)
                    props.setId(temp.id)
                    props.setUsername(temp.username)
                    navigate("/");
                }
            }).catch(error => console.log('error', error));
        setLoading(false)
    };

    return (<Form
        name="basic"
        style={{
            width: 300,
        }}
        onFinish={onFinish}
        autoComplete="off"
    >
        <Form.Item
            name="username"
            rules={[
                {
                    required: true,
                    message: 'Please input your username!',
                },
            ]}
            style={{marginBottom:'30px'}}
        >
            <Input prefix={<UserOutlined className="site-form-item-icon"/>} placeholder="Username"/>
        </Form.Item>

        <Form.Item
            name="password"
            rules={[
                {
                    required: true,
                    message: 'Please input your password!',
                },
            ]}
            style={{marginBottom:'30px'}}
        >
            <Input.Password prefix={<LockOutlined className="site-form-item-icon"/>}
                            type="password"
                            placeholder="Password"/>
        </Form.Item>

        <Form.Item>
            <Button type="primary" htmlType="submit" style={{width: '100%'}} loading={loading}>
                Log in
            </Button>
        </Form.Item>
        <span>Not registered? </span>
        <Link to={'/register'}>
            sign up here.
        </Link>
    </Form>);
};
export default Login;