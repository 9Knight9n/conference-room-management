import React, { useState, useEffect } from 'react';
import { Calendar, Button, Divider, Input, Popconfirm, Timeline } from 'antd';
import {baseURL} from "../../../components/config";
import Schedule from "./Schedule";


function Public (props) {

    const [addRequestInProcess, setAddRequestInProcess] = useState(false);
    const [addRequestLoading, setAddRequestLoading] = useState(false);
    const [title, setTitle] = useState(null);
    const [participant, setParticipant] = useState(null);
    const [duration, setDuration] = useState(null);
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [date, setDate] = useState(null);
    const [confirm, setConfirm] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');
    const [meeting, setMeeting] = useState([]);



    function addRequest(possibilityCheck) {
        setAddRequestLoading(true)

        var myHeaders = new Headers();
        myHeaders.append("authorization", "token " + props.token);

        var formdata = new FormData();
        formdata.append("possibility_check", possibilityCheck?"set":"unset");
        if (title)
            formdata.append("title", title);
        if (participant)
            formdata.append("number_of_participant", participant);
        if (duration)
            formdata.append("duration", duration);
        if (startTime)
            formdata.append("proposed_start_time", startTime);
        if (endTime)
            formdata.append("proposed_end_time", endTime);
        if (date)
            formdata.append("proposed_date", date);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: formdata,
            redirect: 'follow'
        };

        fetch(baseURL + "/api/crm/public/meeting/", requestOptions)
            .then(async response => {
                let temp = JSON.parse(await response.text());

                if (response.status === 409)
                {
                    setConfirm(true)
                }
                if (response.status !== 201)
                {
                    for (const [key, value] of Object.entries(temp)) {
                        props.notif.error({
                            message: 'error (' + key + ")",
                            description: value,
                            placement: 'top',
                        });
                    }
                }
                else {
                    setStartTime(null)
                    setEndTime(null)
                    setTitle(null)
                    setParticipant(null)
                    setDuration(null)
                    setDate(null)
                    setAddRequestInProcess(false)
                    setConfirm(false)
                    props.notif.success({
                            description: "Room added successfully.",
                            message: "Done",
                            placement: 'top',
                        });
                }
            }).catch(error => console.log('error', error)).finally(()=>{setAddRequestLoading(false)})
    }


    function onSelect(value) {
        var myHeaders = new Headers();
        myHeaders.append("authorization", "token " + props.token);

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch(baseURL + "/api/crm/public/meeting/?date="+value.format('YYYY-MM-DD'), requestOptions)
            .then(response => response.text())
            .then(response => {
                let temp = JSON.parse(response);
                setMeeting(temp.meeting)
            }).catch(error => console.log('error', error));
    }

    return (
        <>
            <div style={{display:"flex",justifyContent:"space-between"}}>
                {addRequestInProcess?<Input onChange={(text)=>{setTitle(text.target.value)}} placeholder="Title" style={{ width: '14%' }}/>:""}
                {addRequestInProcess?<Input onChange={(text)=>{setParticipant(text.target.value)}} placeholder="Number of participants" style={{ width: '14%' }}/>:""}
                {addRequestInProcess?<Input onChange={(text)=>{setDuration(text.target.value)}} placeholder="Duration" style={{ width: '14%' }}/>:""}
                {addRequestInProcess?<Input onChange={(text)=>{setStartTime(text.target.value)}} placeholder="Start time" style={{ width: '14%' }}/>:""}
                {addRequestInProcess?<Input onChange={(text)=>{setEndTime(text.target.value)}} placeholder="End time" style={{ width: '14%' }}/>:""}
                {addRequestInProcess?<Input onChange={(text)=>{setDate(text.target.value)}} placeholder="Date" style={{ width: '14%' }}/>:""}
                <Popconfirm
                    title="Are you sure?"
                    open={confirm}
                    onConfirm={() => {
                        addRequest(false)
                    }}
                    onCancel={() => {setConfirm(false)}}
                >
                    <Button loading={addRequestLoading}
                            style={{width:addRequestInProcess?"7%":"100%",transition: 'width 1s ease-in-out', justifySelf:'end'}}
                            type="primary"
                            onClick={addRequestInProcess?()=> {
                                addRequest(true)
                            }:()=>setAddRequestInProcess(true)}>
                        {addRequestInProcess?'Request':'Request a meeting'}
                    </Button>
                </Popconfirm>

            </div>
            <Divider dashed />
            <div style={{display:"flex", width:'100%', justifyContent:"center"}}>
                <Calendar style={{width:'400px'}} fullscreen={false} onSelect={onSelect}/>
                <Divider type="vertical" style={{height:'100%'}}/>
                <Divider type="vertical" style={{height:'100%'}}/>
                <Divider type="vertical" style={{height:'100%'}}/>
                <Divider type="vertical" style={{height:'100%'}}/>
                <Divider type="vertical" style={{height:'100%'}}/>
                {Object.keys(meeting).map((item) => (<Schedule title={item} meeting={meeting[item]}/>))}
            </div>
        </>
    );
};
export default Public;