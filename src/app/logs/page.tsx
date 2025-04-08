"use client"
import { useActionState, useRef, useState, useEffect, FormEvent } from "react";   
import Sidebar from "../setting/sidear";


export default function logs(){

    const [loading, setLoading] = useState(true);
    const [logdata, setLogData] = useState([]);
    let dbarr;
    type arr = {
        TimeGenerated: string,
        code: number,
        Severity: string,
        Message: string
     }

    const fetchData=()=>{

                fetch('/api/logfetch/'
                ,{
                headers : { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
                })
                .then(function(response){
                    console.log(response)
                    return response.json();
                })
                .then(function(myJson) {
                    console.log(myJson);
                    setLogData(myJson.SystemLog);                    
                    setLoading(false);
                });
    }

    useEffect(() => {
        fetchData();
        const element = document.getElementById('TitleLink');
    element.innerHTML = 'System Logs';
      }, []);


        return(        
            <>
             { loading && <div  className="fixed top-0 left-0 right-0 bottom-0 w-full h-screen z-50 overflow-hidden bg-gray-700 opacity-75 flex flex-col items-center justify-center"><div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div><h2 className="text-center text-white text-xl font-semibold">Loading...</h2><p className="w-1/3 text-center text-white">This may take a few seconds, please don't close this page.</p></div>  }
            <Sidebar />
            <div className="mx-auto mt-10 max-w-[50%]">                    
                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Date Time Generated</th>
                                    <th scope="col" className="px-6 py-3">Code</th>
                                    <th scope="col" className="px-6 py-3">Severity</th>  
                                    <th scope="col" className="px-6 py-3">Message</th>                              
                                </tr>
                            </thead>
                            <tbody>

                            {logdata && logdata.length > 0 &&
                                logdata.map(
                                    (item:any) => 
                                        <tr key={item.id + '-row'} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
                                                <th key={item.id + '-time'} scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                    {item.TimeGenerated}
                                                </th>   
                                                <th key={item.id + '-code'} scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                    {item.Code}
                                                </th>  
                                                <th key={item.id + '-severity'} scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                    {item.Severity}
                                                </th>   
                                                <th key={item.id + '-msg'} scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                    {item.Message}
                                                </th>                                            
                                        </tr>
                                )
                            }
                            </tbody>
                        </table>                      
                    </div>
                 </div>
                 <script>
                      
          </script>
            </>   
        );
}