"use client"
import { useActionState, useRef, useState, useEffect, FormEvent } from "react";   
import Sidebar from "../setting/sidear";
import { FormState, saveSchedules } from "@/actions/schedules";

export default function Schedule(){
  const initialState: FormState = {
    errors: {},
    formobjvalues: {},       
  };

  const [state, formAction, isPending] = useActionState( 
    saveSchedules, 
      initialState
  );
  let isChecked; 
  const [duration, setDuration] = useState('');    
  const [schedule, setSchedule] = useState('');
  const [auto, setAuto] = useState(false);
  const [loading, setLoading] = useState(true);
  const [msg, setmsg] = useState('');
  const [msgclass, setmsgclass] = useState('');
  const [msgcaption, setmsgcaptian] = useState('');
  const [showSaveMsg, setshowSaveMsg] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/getSchedule/');
      const data = await res.json();
      setDuration(data.duration);
      setSchedule(data.schedule)
     
      if(data.auto == 1 ){
        setAuto(true);
      }else{
        setAuto(false);
      }

      setLoading(false);
      console.log(data);

      const element = document.getElementById('TitleLink');
      element.innerHTML = 'Setting Schedule';
    };
    fetchData();
  }, []);
  

    const handleSave = (event: any) => { 
      setmsg('');
      setshowSaveMsg (true);
    };

    const handleDurationChange = (event: any) => { 
      setDuration(event.target.value);
    }

    const handleScheduleChange = (event: any) => { 
      setSchedule(event.target.value);
    }

    const handleautochange = (event: any) => { 
            setAuto(!auto);
    }
    
    return(
        <>
         { loading && <div  className="fixed top-0 left-0 right-0 bottom-0 w-full h-screen z-50 overflow-hidden bg-gray-700 opacity-75 flex flex-col items-center justify-center"><div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div><h2 className="text-center text-white text-xl font-semibold">Loading...</h2><p className="w-1/3 text-center text-white">This may take a few seconds, please don't close this page.</p></div>  }
        <Sidebar /> 
        <div className="mx-auto mt-10 max-w-[50%]">   
        { showSaveMsg && state.errors.msg &&
              <div className={state.errors.msgcolor} role="alert">
                  <strong className="font-bold">{state.errors.msgcaption}</strong>
                  <span className="block sm:inline">{state.errors.msg}</span>
              </div> 
          }
<form className="space-y-4 text-gray-700" action={formAction}>  
 
<div className="flex flex-wrap -mx-2 space-y-4 md:space-y-0">
  <div className="w-full px-2 md:w-1/2">
    <label className="block mb-1 font-bold">Run every</label>
    <input type="number" id="duration" name="duration" className="bg-gray-50 border border-gray-400 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={duration} onChange={handleDurationChange}/>
  </div>
  <div className="w-full px-2 md:w-1/2">
    <label className="block mb-1 font-bold">Schedule</label>
    <select id="schedule" name="schedule" value={schedule} onChange={handleScheduleChange} className="bg-gray-50 border border-gray-400 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
      <option value="">Choose a Schedule</option>
      <option value="hours">Hours</option>
      <option value="day">Days</option>        
    </select>
    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
      <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
    </div>
  </div>
</div>
<div className="flex flex-wrap">
  <div className="w-full">
    <label className="inline-flex items-center cursor-pointer">
      <input type="checkbox" name="auto" checked={auto} value={1} className="sr-only peer" onChange={handleautochange}/>
      <div  className="relative w-11 h-6 bg-gray-400 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600" ></div>
      <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Auto Run</span>
    </label>
  </div>
</div>
<button type="submit" className="block w-full p-2 text-white bg-blue-500 rounded disabled:bg-gray-500" onClick={handleSave}>Save Setting</button>
</form>
</div>
</>
    );
}