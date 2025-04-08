"use server";
import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from 'fs';
import path from 'path';
import sql from 'mssql';
import { Pool } from "msnodesqlv8";

export async function POST( req: NextRequest, res: NextResponse){	
    const querystr = "SELECT * FROM sys.databases";		
    const formData = await req.formData();			
    const dbpath = formData.get('dbpath') as string;	
    let resultdata = null;
    var returncode = 500;
    let pool, sq :any;
    let queryresult;

            async function getServices() {	
                    return new Promise((resolve) => {
                            pool = new sql.ConnectionPool(dbpath);
                            pool.connect().then(pool =>{						
                                 return pool.request().query(querystr);						
                            }).then((result)=> {								
                                resolve(result);
                            }).catch(err => {	
                                console.log("ERROR:", err)
                            }).finally((result)=>{
                                resolve("Error");
                            });
                    });		
            }

        const data:any = await getServices();
        let resdata:any = data['recordset']; 
        let nameArray = [];
        let jsonArray  = [];
        if(data == 'Error'){
            returncode = 500;	
            jsonArray.push(returncode);
            jsonArray.push("No Data");		
        }else{
            returncode =200;
            jsonArray.push(returncode);
            for(let i = 0; i < resdata.length; i++){		
                nameArray.push(resdata[i]['name']);
            };
            jsonArray.push(nameArray);
        }

        return NextResponse.json({json: jsonArray}, {status: returncode });	

}
        
        
    