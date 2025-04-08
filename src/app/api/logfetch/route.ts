"use server";
import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), '/sync-server/sync-settings/systemlog.json');

export async function GET( req: NextApiRequest,
    res: NextApiResponse ){
            try {													                                       
                   const jsonData =  await fs.readFile(dataFilePath, 'utf-8');    
                   return new Response(jsonData);
            } catch (error) {
                    console.error(error);      				
            }   
}
