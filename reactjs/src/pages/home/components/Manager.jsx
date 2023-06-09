import React, { useState, useEffect } from 'react';
import { Table, Switch, Button, Divider, Input, InputNumber, Select, Space } from 'antd';
import {baseURL} from "../../../components/config";


function Manager (props) {

    const [data, setData] = useState([]);
    const [room, setRoom] = useState([]);
    const [addRoomInProcess, setAddRoomInProcess] = useState(false);
    const [addRoomLoading, setAddRoomLoading] = useState(false);
    const [roomName, setRoomName] = useState(null);
    const [roomCapacity, setRoomCapacity] = useState(null);
    const [dataLoading, setDataLoading] = useState([]);
    const [startList, setStartList] = useState([]);
    const [endList, setEndList] = useState([]);
    const [dateList, setDateList] = useState([]);
    const [roomList, setRoomList] = useState([]);

    useEffect(() => {
        fetchData()
        fetchRoomData()
    }, []);

    function fetchRoomData() {
        var myHeaders = new Headers();
        myHeaders.append("authorization", "token " + props.token);

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch(baseURL + "/api/crm/manager/room/", requestOptions)
            .then(response => response.text())
            .then(response => {
                let temp = JSON.parse(response);
                setRoom(temp.room)
            }).catch(error => console.log('error', error));
    }

    function fetchData() {
        var myHeaders = new Headers();
        myHeaders.append("authorization", "token " + props.token);

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch(baseURL + "/api/crm/manager/meeting/", requestOptions)
            .then(response => response.text())
            .then(response => {
                let temp = JSON.parse(response);
                let n = temp.meeting.length
                let a = new Array(n);
                for (let i=0; i<n; ++i)
                {
                    a[i] = false
                }
                setStartList(a)
                setEndList(a)
                setDateList(a)
                setRoomList(a)
                for (let i=0; i<n; ++i) temp.meeting[i]['key'] = i;
                setData(temp.meeting)
            }).catch(error => console.log('error', error));
    }


    const columns = [
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'username',
            dataIndex: 'requester_username',
            key: 'requester_username',
        },
        {
            title: 'Participants',
            dataIndex: 'number_of_participant',
            key: 'number_of_participant',
        },
        {
            title: 'Proposed start',
            dataIndex: 'proposed_start_time',
            key: 'proposed_start_time',
        },
        {
            title: 'Proposed end',
            dataIndex: 'proposed_end_time',
            key: 'proposed_end_time',
        },
        {
            title: 'Duration',
            dataIndex: 'duration',
            key: 'duration',
        },
        {
            title: 'Proposed date',
            dataIndex: 'proposed_date',
            key: 'proposed_date',
        },
        {
            title: 'Start',
            dataIndex: 'start_time',
            key: 'start_time',
            render: (_,record) => (
                <Input
                    // value={startList[_]}
                    // defaultValue={record['start_time']}
                    onChange={(text)=>{setStartList([
                        ...startList.slice(0,_),
                        text.target.value,
                        ...startList.slice(_+1,startList.length)
                    ])}}
                    style={{
                    width: 80,
                    }}
                    />
            ),
        },
        {
            title: 'End',
            dataIndex: 'end_time',
            key: 'end_time',
            render: (_,record) => (
                <Input
                    onChange={(text)=>{setEndList([
                        ...endList.slice(0,_),
                        text.target.value,
                        ...endList.slice(_+1,endList.length)
                    ])}}
                    // value={endList[_]}
                    // defaultValue={record['end_time']}
                    style={{
                    width: 80,
                    }}
                    />
            ),
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            render: (_,record) => (
                <Input
                    onChange={(text)=>{setDateList([
                        ...dateList.slice(0,_),
                        text.target.value,
                        ...dateList.slice(_+1,dateList.length)
                    ])}}
                    // value={dateList[_]}
                    // defaultValue={record['date']}
                    style={{
                    width: 100,
                    }}
                    />
            ),
        },
        {
            title: 'Room',
            dataIndex: 'room_id',
            key: 'room',
            render: (_,record) => (
                <Select
                    // defaultValue={record['room_id']}
                    style={{
                    width: 125,
                    }}
                    onChange={(value) => {
                        console.log(value)
                        console.log(_)
                        setRoomList([
                        ...roomList.slice(0,_),
                        value,
                        ...roomList.slice(_+1,roomList.length)
                    ])}}
                    options={room.map((item)=>{return {value:item['id'],label:item['name']+"(s:"+item['capacity']+")"}})}
                    />
            ),
        },
        {
            title: 'Action',
            dataIndex: 'key',
            key: 'action',
            render: (_,record) => (
                <Button
                    loading={dataLoading[_]}
                    type="primary"
                    onClick={() => {updateMeeting(_,record['id'])}}
                    >
                    Schedule
                </Button>
            ),
        },
    ];

    function updateMeeting(index,meeting_id) {
        setDataLoading([
            ...dataLoading.slice(0,index),
            true,
            ...dataLoading.slice(index+1,dataLoading.length)]
        )

        var myHeaders = new Headers();
        myHeaders.append("authorization", "token " + props.token);

        console.log(startList)
        console.log(roomList)
        console.log(index)
        console.log(startList[index])

        var formdata = new FormData();
        formdata.append("meeting_id", meeting_id);
        if (startList[index])
            formdata.append("start_time", startList[index]);
        if (endList[index])
            formdata.append("end_time", endList[index]);
        if (dateList[index])
            formdata.append("date", dateList[index]);
        if (roomList[index])
            formdata.append("room_id", roomList[index]);

        var requestOptions = {
            method: 'PUT',
            headers: myHeaders,
            body: formdata,
            redirect: 'follow'
        };

        fetch(baseURL + "/api/crm/manager/meeting/", requestOptions)
            .then(async response => {
                let temp = JSON.parse(await response.text());
                if (response.status !== 201)
                    for (const [key, value] of Object.entries(temp)) {
                        props.notif.error({
                            message: 'error (' + key + ")",
                            description: value,
                            placement: 'top',
                        });
                    }
                else {
                    fetchData()
                }
            }).catch(error => console.log('error', error)).finally(()=>{setDataLoading([
            ...dataLoading.slice(0,index),
            false,
            ...dataLoading.slice(index+1,dataLoading.length)]
        )})
    }

    function addRoom() {
        setAddRoomLoading(true)

        var myHeaders = new Headers();
        myHeaders.append("authorization", "token " + props.token);

        var formdata = new FormData();
        if (roomName)
            formdata.append("name", roomName);
        if (roomCapacity)
            formdata.append("capacity", roomCapacity);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: formdata,
            redirect: 'follow'
        };

        fetch(baseURL + "/api/crm/manager/room/", requestOptions)
            .then(async response => {
                let temp = JSON.parse(await response.text());
                if (response.status !== 201)
                    for (const [key, value] of Object.entries(temp)) {
                        props.notif.error({
                            message: 'error (' + key + ")",
                            description: value,
                            placement: 'top',
                        });
                    }
                else {
                    setRoomCapacity(null)
                    setRoomName(null)
                    setAddRoomInProcess(false)
                    props.notif.success({
                            description: "Room added successfully.",
                            message: "Done",
                            placement: 'top',
                        });
                }
            }).catch(error => console.log('error', error)).finally(()=>{setAddRoomLoading(false)})
    }

    return (
        <>
            <div style={{display:"flex",justifyContent:"space-between"}}>
                {addRoomInProcess?<Input onChange={(text)=>{setRoomName(text.target.value)}} placeholder="Room name" style={{ width: '55%' }}/>:""}
                {/*{addRoomInProcess?<Divider dashed type="vertical" />:""}*/}
                {addRoomInProcess?<InputNumber onChange={(text)=>{setRoomCapacity(text)}} placeholder="Room capacity" style={{ width: '20%' }}/>:""}
                {/*{addRoomInProcess?<Divider dashed type="vertical" />:""}*/}
                <Button loading={addRoomLoading}
                        style={{width:addRoomInProcess?"20%":"100%",transition: 'width 1s ease-in-out', justifySelf:'end'}}
                        type="primary"
                        onClick={addRoomInProcess?addRoom:()=>setAddRoomInProcess(true)}>
                    {addRoomInProcess?'Add':'Add new conference room'}
                </Button>
            </div>
            <Divider dashed />
            <Table size={'small'} pagination={
                {
                    position: ['none', 'none'],
                }
            } columns={columns} dataSource={data} />
        </>
    );
};
export default Manager;