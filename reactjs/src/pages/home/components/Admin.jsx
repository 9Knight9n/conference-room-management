import React, { useState, useEffect } from 'react';
import { Table, Switch  } from 'antd';
import {baseURL} from "../../../components/config";


function Admin (props) {

    const [data, setData] = useState([]);
    const [dataLoading, setDataLoading] = useState([]);
    const [dataActive, setDataActive] = useState([]);

    useEffect(() => {
        fetchData()
    }, []);


    function fetchData() {
        var myHeaders = new Headers();
        myHeaders.append("authorization", "token " + props.token);

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch(baseURL + "/api/crm/admin/user/", requestOptions)
            .then(response => response.text())
            .then(response => {
                let temp = JSON.parse(response);
                let n = temp.users.length
                let a = new Array(n); for (let i=0; i<n; ++i) a[i] = false;
                setDataLoading(a)
                let b = new Array(n); for (let i=0; i<n; ++i) b[i] = temp.users[i]['is_manager'];
                setDataActive(b)
                for (let i=0; i<n; ++i) temp.users[i]['key'] = i;
                setData(temp.users)
            }).catch(error => console.log('error', error));
    }


    const columns = [
        {
            title: 'Username',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Manager',
            dataIndex: 'key',
            key: 'permission',
            render: (_,record) => (<Switch loading={dataLoading[_]} checked={dataActive[_]}
                                           disabled={record['is_admin']} onChange={async () => {
                await changePermission(record['id'],_)
            }} defaultChecked />),
        },
    ];

    function changePermission(id,index) {
        setDataLoading([
            ...dataLoading.slice(0,index),
            true,
            ...dataLoading.slice(index+1,dataLoading.length)]
        )


        var myHeaders = new Headers();
        myHeaders.append("authorization", "token " + props.token);

        var formdata = new FormData();
        formdata.append("user_id", id);
        formdata.append("is_manager", dataActive[index]?"unset":'set');

        var requestOptions = {
            method: 'PUT',
            headers: myHeaders,
            body: formdata,
            redirect: 'follow'
        };

        fetch(baseURL + "/api/crm/admin/user/", requestOptions)
            .then(response => response.text())
            .then(response => {
                let temp = JSON.parse(response);
                setDataActive([
                    ...dataActive.slice(0,index),
                    temp.is_manager,
                    ...dataActive.slice(index+1,dataActive.length)]
                )
            }).catch(error => console.log('error', error));


        setDataLoading([
            ...dataLoading.slice(0,index),
            false,
            ...dataLoading.slice(index+1,dataLoading.length)]
        )

    }

    return (
        <>
            <Table size={'small'} pagination={
                {
                    position: ['none', 'none'],
                }
            } columns={columns} dataSource={data} />
        </>
    );
};
export default Admin;