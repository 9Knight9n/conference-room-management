import { Radio, Timeline } from 'antd';
import React, { useState , useEffect} from 'react';
import {baseURL} from "../../../components/config";
function Schedule (props) {


  return (
    <>
      <div style={{display:"flex",flexDirection:'column',alignItems:'center' ,justifyContent:"center"}}>
          <p style={{width:"fit-content"}}>{props.title}</p>
          <Timeline mode={'left'} style={{width:'300px',marginTop:"20px"}}>
              {
                  props.meeting.map((item) => (
                      <Timeline.Item label={item['start_time'] + " to " + item['end_time']}>
                          {item['title']+" - held by: "+item['username']}
                      </Timeline.Item>
                  ))
              }
          </Timeline>
      </div>
    </>
  );
};
export default Schedule;