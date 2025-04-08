"use client";
import { useActionState, useRef, useState, useEffect, FormEvent } from "react";   
import { FormState, saveSettings } from "@/actions/settings";
import { DBoptions } from "@/components/DBoptions";
import Sidebar from "./sidear";

export default function Setting(){
  let dbarray: any;
  const pathInput = useRef<HTMLInputElement>(null);
  const initialState: FormState = {
    errors: {},
    formobjvalues: {},       
  };

const [state, formAction, isPending] = useActionState( 
    saveSettings, 
    initialState
);

const [dbpathval, setDBpath] = useState('');
const [dbtypeval, setDBtype] = useState('');
const [loading, setLoading] = useState(true);
const [loadingmsg, setLoadingMsg] = useState('Loading...');
const [msg, setmsg] = useState('');
const [msgclass, setmsgclass] = useState('');
const [msgcaption, setmsgcaptian] = useState('');
const [showdb, setDBshow] = useState(false); 
const [dblist, setdblist] = useState('');
const [showverify, setshowverify] = useState(true); 
const [showsavebtn, setShowSave] = useState(false);
const [hiddendb, setHiddenDB] = useState('');
const [showSaveMsg, setshowSaveMsg] = useState(true);

useEffect(() => {
  const fetchData = async () => {
    const res = await fetch('/api/');
    const data = await res.json();
    setDBpath(data.dbpath);    
    setLoading(false);
    console.log(data);
  };
  fetchData();
  const element = document.getElementById('TitleLink');
    element.innerHTML = 'Database Connection Settings';
}, []);



  const handlePathChange = (event: any) => { 
      setDBpath(event.target.value);
      setDBshow(false);
      setmsg('');
      setShowSave(false);
      setshowverify(true);
  }    

  const handleSave = (event: any) => { 
    setmsg('');
    setshowSaveMsg (true);
  }

  const sendConnectionParamsToAPI = async () => {          
          const formData = new FormData();           
          const pathval = pathInput.current?.value;  
          setshowSaveMsg(false);
          if( pathval == ''){   
              setmsgcaptian('Error: ');
              setmsg('Connection string must be filled in.');  
              setmsgclass('bg-red-100 border mt-10 border-red-400 text-red-700 px-4 py-3 rounded relative'); 
          }else{
              setLoading(true);
              setLoadingMsg('Verifying Database Connection String.');
              formData.set("dbpath", pathval as string);
              const res = await fetch('/api/verifyconn/', {
                          method: 'POST',                    
                          body: formData,    
                          cache: 'no-cache',       
              });  
              const data = await res.json();
              const jsondata = data.json; 
              
              if(res.status == 500){
                    setmsgcaptian('Connection verified: ');
                    setmsg('Connection string is invalid.');
                    setmsgclass('bg-red-100 border mt-10 border-red-400 text-red-700 px-4 py-3 rounded relative');                   
                    setDBshow(false);
              }else if(res.status==200){
                    setmsgcaptian('Connection verified: ');
                    setmsg('Connection string is valid.');
                    setmsgclass('bg-blue-100 border mt-10 border-blue-400 text-blue-700 px-4 py-3 rounded relative');                   
                    dbarray = jsondata.toString().split(",");
                    dbarray.shift();                   
                    setdblist(dbarray);
                    setshowverify(false);                
                    setDBshow(true);
              }
              setLoading(false);
          }
    }; 

    
    return(
      <>
     { loading && <div  className="fixed top-0 left-0 right-0 bottom-0 w-full h-screen z-50 overflow-hidden bg-gray-700 opacity-75 flex flex-col items-center justify-center"><div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div><h2 className="text-center text-white text-xl font-semibold">{loadingmsg}</h2><p className="w-1/3 text-center text-white">This may take a few seconds, please don't close this page.</p></div>  }

        <Sidebar /> 
      <div className="mx-auto mt-10 max-w-[50%]">  
                 
          { msg && 
              <div className={msgclass} role="alert">
                    <strong className="font-bold">{msgcaption}</strong>
                    <span className="block sm:inline">{msg}</span>
              </div> 
          }
          { showSaveMsg && state.errors.msg &&
              <div className={state.errors.msgcolor} role="alert">
                  <strong className="font-bold">{state.errors.msgcaption}</strong>
                  <span className="block sm:inline">{state.errors.msg}</span>
              </div> 
          }
          <form className="max-w-full mx-auto mt-10" action={formAction}>
            <div className="mb-5">
                <label className="block mb-2 text-md font-bold text-gray-900 dark:text-white">Connection String</label>
                <input type="text"  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" name="dbpath"  id="dbpath"  ref={pathInput}  value={dbpathval} onChange={handlePathChange}/>
            </div>
            {showverify && <div className="mb-5"><button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={sendConnectionParamsToAPI}>Verify Connection</button></div> }
            { showdb && <DBoptions data = {dblist} setState={setShowSave} setHidden={setHiddenDB} dbtypeval={dbtypeval} setDBtype={setDBtype}/> }
            { showsavebtn && <button type="submit" className="block w-full p-2 text-white bg-blue-500 rounded disabled:bg-gray-500" onClick={handleSave}>Save Setting</button> }
            <input type="hidden" name="HiddenDBval" id="HiddenDBval" value={hiddendb} onChange={(event) => { setHiddenDB(event.target.value); }}></input>
          </form>
      </div>
      </>
    );


    
}

   
      
