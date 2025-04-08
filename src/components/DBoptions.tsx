 /*export const DBoptions = ({ data }: { data:  any }, {setState} : {  setState: any}) => {*/
 export const DBoptions = ({ data, setState, setHidden, dbtypeval, setDBtype }: { data:  any, setState: any, setHidden: any, dbtypeval:string, setDBtype:any} ) => {
    const handleDBChange = (event: any) => {        
            if(event.target.value){
                setState(true);
                setHidden(event.target.value);
                setDBtype(event.target.value);
            }else{
                setState(false);
                setHidden('');
                setDBtype('');
            }       
      }


    return(
        <div className="mb-5">
            <label className="block mb-2 text-md font-bold  text-gray-900 dark:text-white">Select Database</label>
            <select id="DBSelect" name="DBSelect" className="bg-gray-50 border border-gray-300 text-gray-900 mb-6 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={dbtypeval}  onChange={handleDBChange}>
                    <option value="">Choose a database</option> 
                    {data.map((item:any) => <option key={item} value={item}>{item}</option>)}
            </select>
        </div>
    );
};