"use server";
import { promises as fs } from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), "/sync-server/sync-settings/scheduleData.json");

    export async function updateSchedule(
        duration: string,
        schedule: string,
        auto: string ){
          //  await new Promise((resolve) => setTimeout(resolve, 1000));
            try {													
                    const data =
                    {
                        duration: duration,
                        schedule: schedule,
                        auto: auto
                    };      				
                    const stringData = JSON.stringify(data)      				
                    await fs.writeFile(dataFilePath, stringData);
                    return 1;
            } catch (error) {
                    console.error(error); 
                    return 0;     				
                }
    }


    