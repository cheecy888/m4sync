
"use server";
import { updateSettings } from "@/settings-db"; 
import { redirect } from "next/navigation";

export type SubmitResponse = {
    msg?:string;
    msgcolor?:string;
	msgcaption?:string;
};

export type Formvalues = {
    dbpathval?:string;
    dbtypeval?:string;  
};

export type FormState ={
        errors:SubmitResponse;
		formobjvalues: Formvalues;
};


export async function saveSettings(prevState: FormState, formData: FormData){
    	const dbpath = formData.get("dbpath") as string;
    	const dbtype = formData.get("HiddenDBval") as string;	
		console.log('dbpath :'+dbpath+ ' dbtype : '+dbtype);
		const errors: SubmitResponse = {  };
		const formobjvalues: Formvalues = {};
		formobjvalues.dbpathval = dbpath;
		formobjvalues.dbtypeval = dbtype;
    	if(!dbpath){
        	errors.msg = "Database path is required.";
			errors.msgcolor = "red";
			errors.msgcaption = "Error:";
    	}
    	if(!dbtype){
			if(errors.msg)
        	{ errors.msg += "Database type is required."; }
			else
			{ errors.msg = "Database type is required."; }
			errors.msgcolor = "bg-red-100 border mt-10 border-red-400 text-red-700 px-4 py-3 rounded relative";
			errors.msgcaption = "Error:";
    	}   
    	if(Object.keys(errors).length > 0 ){
        	return {errors,formobjvalues};
    	}else{
			await updateSettings(dbpath, dbtype);
			errors.msg = "Settings saved successfully.";
			errors.msgcolor = "bg-blue-100 border mt-10 border-blue-400 text-blue-700 px-4 py-3 rounded relative";
			errors.msgcaption = "Saved Success:";
			return {errors,formobjvalues};
		}
}


