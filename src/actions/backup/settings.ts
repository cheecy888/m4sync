
"use server";
import { updateSettings } from "@/settings-db"; 
import { redirect } from "next/navigation";

export type Errors = {
    dbpath?:string;
    dbtype?:string;  
};

export type Formvalues = {
    dbpathval?:string;
    dbtypeval?:string;  
};


/*export type FormResponse = {
    result?:boolean;    
};*/

export type FormState ={
        errors:Errors;
		formobjvalues: Formvalues;
		/*submitresponse: FormResponse;*/
};


export async function saveSettings(prevState: FormState, formData: FormData){
    
    	const dbpath = formData.get("dbpath") as string;
    	const dbtype = formData.get("DBSelect") as string;	

		const errors: Errors = {  };
		const formobjvalues: Formvalues = {};

		formobjvalues.dbpathval = dbpath;
		formobjvalues.dbtypeval = dbtype;

		

    	if(!dbpath){
        	errors.dbpath = "Database path is required.";
			//return {errors};
    	}
    	if(!dbtype){
        	errors.dbtype = "Database type is required.";
			//return {errors};
    	}   
    	if(Object.keys(errors).length > 0 ){
        	return {errors,formobjvalues};
    	}
		
		//submitresponse.result = false;
		await updateSettings(dbpath, dbtype);
		redirect("/settings");

	
}


export async function verifyDBConnection(prevState: FormState, formData: FormData){


}