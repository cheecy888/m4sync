"use server";
import { promises as fs } from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), "/sync-server/sync-settings/settingData.json");

	export async function updateSettings(
		dbpath: string,
		dbtype: string ){
			await new Promise((resolve) => setTimeout(resolve, 100));

			try {													
					const data =
					{
						dbpath: dbpath,
    					dbtype: dbtype
    				};      				
					const stringData = JSON.stringify(data)      				
					await fs.writeFile(dataFilePath, stringData);
      				return 1;
			} catch (error) {
      				console.error(error); 
					return 0;     				
    			}
	}


	