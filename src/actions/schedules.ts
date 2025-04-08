
"use server";
import { updateSchedule } from "@/settings-schedule";
import { redirect } from "next/navigation";

export type SubmitResponse = {
    msg?:string;
    msgcolor?:string;
    msgcaption?:string;
};

export type Formvalues = {
    duration?:string;
    schedule?:string;  
    auto?:string;
};

export type FormState ={
        errors:SubmitResponse;
        formobjvalues: Formvalues;
};


export async function saveSchedules(prevState: FormState, formData: FormData){
        const duration = formData.get("duration") as string;
        const schedule = formData.get("schedule") as string;	
        const auto = formData.get("auto") as string;
       
        const errors: SubmitResponse = {  };
        const formobjvalues: Formvalues = {};
        formobjvalues.duration = duration;
        formobjvalues.schedule = schedule;
        formobjvalues.auto = auto;

        if(!duration){
            errors.msg = "Duration must be filled.";
            errors.msgcolor = "red";
            errors.msgcaption = "Error:";
        }

        if(!schedule){
            if(errors.msg)
            { errors.msg += "Schedule must be selected"; }
            else
            { errors.msg = "Schedule must be selected."; }
            errors.msgcolor = "bg-red-100 border mt-10 border-red-400 text-red-700 px-4 py-3 rounded relative";
            errors.msgcaption = "Error:";
        }   

        if(Object.keys(errors).length > 0 ){
            return {errors,formobjvalues};
        }else{
            await updateSchedule(duration, schedule, auto);
            errors.msg = "Schedule Settings saved successfully.";
            errors.msgcolor = "bg-blue-100 border mt-10 border-blue-400 text-blue-700 px-4 py-3 rounded relative";
            errors.msgcaption = "Saved Success:";
            return {errors,formobjvalues};
        }
}


