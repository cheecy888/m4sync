    const express = require('express'); // Importing express
    const sql = require("mssql");
    const fs = require('fs');   
    const app = express(); // Creating an express app    
    var configdata, dbpathconfig;
    var mssqlpath, defquery, collookup, colvar=[], payload, payline, invline, glline;
    var authkey = "";
    var respjson;

    const util = require('util');
    const BASEURL = 'https://integrated.dev.datumcorp.com'    
    /*-------------------add details of sqlConfig-----------------*/    
    try {           

            /* Fetch Proline Database Connectionstring */
            const DBpathjson = fs.readFileSync("./sync-settings/settingData.json");
            dbpathconfig      = JSON.parse(DBpathjson);
            mssqlpath       = `${dbpathconfig.dbpath};Database=${dbpathconfig.dbtype}`;

            /* Fetch M4 payload config JSON data */
            const jsonString = fs.readFileSync("./sync-settings/sync-config.json");
            configdata      = JSON.parse(jsonString);                     
            defquery        = configdata.Demopest.Source.defaultquery;
            collookup       = configdata.Demopest.Source.columnlookup;

            payload         = configdata.Demopest.Source.targetpayload;
            payline         = configdata.Demopest.Source.paymentline;
            invline         = configdata.Demopest.Source.invoiceline;
            glline          = configdata.Demopest.Source.glline;
            plinedata       = configdata.Demopest.Source.dataarray[0].plinedata;
            plineacct       = configdata.Demopest.Source.dataarray[0].plineacct;
            invlinedata     = configdata.Demopest.Source.dataarray[0].invlinedata;
            gllinedata      = configdata.Demopest.Source.dataarray[0].gllinedata;
            gllineitem      = configdata.Demopest.Source.dataarray[0].gllineitem;
            gllineacct      = configdata.Demopest.Source.dataarray[0].gllineacct;

      } catch (err) {
            console.log(err);
            return;
      }
  /******************************************************************/

function findIndexbyKeyVal(k, val, objArray){
    let objIndex = objArray.findIndex(
        (temp) => temp[k] === val
    );
    return objIndex;
}


async function fetchGet(paramval, objarr, auth, mhtd) {
	        /* Overwrite paramval for testing */
            var extraheaderparam = '';
            if (objarr.column=='AccNo') { paramval = 'M4EXT-2409-0001'; }
	        if (objarr.column=='CashCode') { paramval = 'CA'; }
	        if (objarr.column=='PayMode') { paramval = 'Cheque'; }
	        if (objarr.column=='CurrCode') { paramval = 'MYR'; }
	        if (objarr.column=='InvNo') { 
                paramval = 'M4EXTINV-25-0010'; 
                extraheaderparam = 'AAAAAwAAQACAAAAAAAAAAQ';
            }
	        if (objarr.column=='GLCode') { paramval = 'CA'; }
	        if (objarr.column=='DocType') { paramval = 'Official%20Receipt'; }
	        if (objarr.column=='Status') { paramval = 'Confirmed'; }
	        /******************************* */
	        var apipathstr = objarr.apipath;
	        apipathstr = apipathstr.replace("[param]",paramval);
            const res = await fetch(`${BASEURL}${apipathstr}`, {
                    method: mhtd,
                    headers: {
                            'User-Agent': 'undici-stream-example', /* unneed*/
                            'Content-Type': 'application/json',
                            'User-Agent': 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36 Edg/134.0.0.0', /* unneed */ 
                            'Upgrade-Insecure-Requests': 1,
                            'sec-ch-ua-platform':'Windows',
                            'sec-ch-ua': '"Chromium";v="134", "Not:A-Brand";v="24", "Microsoft Edge";v="134"',
                            'sec-ch-ua-mobile':'?0',                
                            'Authorization': `Bearer ${auth}`,
                            'folderId': extraheaderparam
                    },       
            });
            var response = await res.json()            
            return response;
    }

function findMultiIndexbyKeyVal(key, value, objarray){
    var outputarray = [];
    for(var i = 0; i < objarray.length;i++){
            if(objarray[i][key]==value) { outputarray.push(i); }
    }
    return outputarray;
}

function format_payload(objpayload, datarray){    
    let outputarray={};     
    let colkey, colvalue, datamapstr, maparray, counter=0;
    let dataarr
    if(objpayload.length > 0){
            for (let col of objpayload) {
                    colkey = col.key;
                    colvalue = col.value;
                    if(col.isdata){
                        datamapstr = col.datamap;
                        maparray = datamapstr.split(',');
                        if(maparray.length > 0 ){ 
                            if(maparray.length == 1 ) {
                                if(datarray[0][datamapstr])
                                { outputarray[colkey] = datarray[0][datamapstr];  }

                            }else{
                                dataarr = [];
                                for (let dm of maparray) {
                                    if(datarray[0][dm])
                                    { dataarr.push(datarray[0][dm]); }
                                }
                                outputarray[colkey] = dataarr;
                            }                           
                        }                        
                        
                    }else{
                        outputarray[colkey]=colvalue;
                    }
                    counter++;
            }            
    }
    return outputarray;
}


    app.get("/sync", async (req, res) => {
        try {
            var poolConnection = await sql.connect(mssqlpath);           
            var resultSet = await poolConnection.request().query(defquery);
            var fieldarr;            
            var columns = "", idxcol, idx, foundindex, dataarray;
            
            /* For payload data */
            let ploadindex;

            /* For payment lines*/
            let plineindex, plineloadindex;

            /* For Invocie lines */
            let invlineindex, invlineloadindex;

            /* For GL lines */
            let gllineindex, gllineloadindex;

            /* */
            let plinedataindex, plinedataloadindex;
            let plineacctindex, plineacctloadindex;
            let invlinedataindex, invlinedataloadindex;
            let gllinedataindex, gllinedataloadindex;
            let gllineitemindex, gllineitemloadindex;
            let gllineacctindex, gllineacctloadindex;

            for (var column in resultSet.recordset.columns) {
                columns += column + ",";
            }
                   
            columns = columns.trim();
            columns = columns.substring(0, columns.length - 1);
            for(var i = 0; i < collookup.length;i++){   colvar.push(collookup[i]['column']);  }
            fieldarr = columns.split(",");           
                          
                for (let row of resultSet.recordset){
                    var ispaymentline = false, isglline = false, isinvline = false;

                    /* Re-initialize the data template array*/
                    payload         = configdata.Demopest.Source.targetpayload;
                    payline         = configdata.Demopest.Source.paymentline;
                    invline         = configdata.Demopest.Source.invoiceline;
                    glline          = configdata.Demopest.Source.glline;
                    plinedata       = configdata.Demopest.Source.dataarray[0].plinedata;
                    plineacct       = configdata.Demopest.Source.dataarray[0].plineacct;
                    invlinedata     = configdata.Demopest.Source.dataarray[0].invlinedata;
                    gllinedata      = configdata.Demopest.Source.dataarray[0].gllinedata;
                    gllineitem      = configdata.Demopest.Source.dataarray[0].gllineitem;
                    gllineacct      = configdata.Demopest.Source.dataarray[0].gllineacct;

                    /* Check for include payment, Invoice and GL lines */
                    if(row['RcpNo']){ ispaymentline = true; }
                    if(row['GLCode']) { isglline = true;}
                    if(row['InvNo']) { isinvline = true;}

                    for (let col of colvar) {
                        
                        if(fieldarr.includes(col)){                        
                                    idx = findIndexbyKeyVal("column", col, collookup); 
                                    idxcol = collookup[idx];   
                                    paramval =  row[col];
                                    respjson = await fetchGet(row[col], idxcol, authkey, 'GET');
                                    if (respjson.ok){
                                            foundindex = findMultiIndexbyKeyVal("map", col, payload); 
                                            if(foundindex.length > 0){
                                                for (let pindex of foundindex) {                                                                
                                                    payload[pindex]['value'] = respjson['data'][0][payload[pindex]['sourcefield']];
                                                    payload[pindex]['updated'] = true; 
                                                }
                                           }

                                            if(ispaymentline){
                                                   plineindex = findMultiIndexbyKeyVal("map", col, payline);
                                                   if(plineindex.length > 0){
                                                        for (let plindex of plineindex) {
                                                                payline[plindex]['value'] = respjson['data'][0][payline[plindex]['sourcefield']];
                                                                payline[plindex]['updated'] = true; 
                                                        }
                                                    }
                                                    plinedataindex = findMultiIndexbyKeyVal("map", col, plinedata);
                                                    plineacctindex = findMultiIndexbyKeyVal("map", col, plineacct);
                                                    if(plinedataindex.length > 0){
                                                        for (let pldataindex of plinedataindex) {
                                                                plinedata[pldataindex]['value'] = respjson['data'][0][plinedata[pldataindex]['sourcefield']];
                                                                plinedata[pldataindex]['updated'] = true; 
                                                        }
                                                    }
                                                    if(plineacctindex.length > 0){
                                                        for (let placctindex of plineacctindex) {
                                                                plineacct[placctindex]['value'] = respjson['data'][0][plineacct[placctindex]['sourcefield']];
                                                                plineacct[placctindex]['updated'] = true; 
                                                        }
                                                    }
                                            }        

                                            if(isinvline){
                                                    invlineindex = findMultiIndexbyKeyVal("map", col, invline);
                                                    if(invlineindex.length > 0){
                                                        for (let invlindex of invlineindex) {
                                                                invline[invlindex]['value'] = respjson['data'][0][invline[invlindex]['sourcefield']];
                                                                invline[invlindex]['updated'] = true; 
                                                        }
                                                    }                                                    
                                                    invlinedataindex = findMultiIndexbyKeyVal("map", col, invlinedata);
                                                    if(invlinedataindex.length > 0){
                                                        for (let invldataindex of invlinedataindex) {
                                                                invlinedata[invldataindex]['value'] = respjson['data'][0][invlinedata[invldataindex]['sourcefield']];
                                                                invlinedata[invldataindex]['updated'] = true; 
                                                        }
                                                    }
                                            }

                                            if(isglline){
                                                    gllineindex = findMultiIndexbyKeyVal("map", col, glline);
                                                    if(gllineindex.length > 0){
                                                        for (let gllindex of gllineindex) {
                                                                glline[gllindex]['value'] = respjson['data'][0][glline[gllindex]['sourcefield']];
                                                                glline[gllindex]['updated'] = true; 
                                                        }
                                                    }
                                                    gllinedataindex = findMultiIndexbyKeyVal("map", col, gllinedata);
                                                    if(gllinedataindex.length > 0){
                                                        for (let glldataindex of gllinedataindex) {
                                                                gllinedata[glldataindex]['value'] = respjson['data'][0][gllinedata[glldataindex]['sourcefield']];
                                                                gllinedata[glldataindex]['updated'] = true; 
                                                        }
                                                    }
                                                    gllineitemindex = findMultiIndexbyKeyVal("map", col, gllineitem);
                                                    if(gllineitemindex.length > 0){
                                                        for (let gllitemindex of gllineitemindex) {
                                                                gllineitem[gllitemindex]['value'] = respjson['data'][0][gllineitem[gllitemindex]['sourcefield']];
                                                                gllineitem[gllitemindex]['updated'] = true; 
                                                        }
                                                    }
                                                    gllineacctindex = findMultiIndexbyKeyVal("map", col, gllineacct);
                                                    if(gllineacctindex.length > 0){
                                                        for (let gllacctindex of gllineacctindex) {
                                                                gllineacct[gllacctindex]['value'] = respjson['data'][0][gllineacct[gllacctindex]['sourcefield']];
                                                                gllineacct[gllacctindex]['updated'] = true; 
                                                        }
                                                    }
                                            }

                                    }else{
                                            /* Here, if lookup json OK status = false, log into log record */
                                    }       
                        }
                    }
                                
                    for (let element of fieldarr) {                        
                            if(!colvar.includes(element)){                                
                                ploadindex = findMultiIndexbyKeyVal("sourcefield", element, payload);                                
                                if(ploadindex.length > 0){
                                    for (let p of ploadindex) {
                                        payload[p]['value'] = row[element];
                                        payload[p]['updated'] = true;
                                    }
                                }

                                if(ispaymentline){
                                    plineloadindex = findMultiIndexbyKeyVal("sourcefield", element, payline);
                                    if(plineloadindex.length > 0){
                                        for (let p of plineloadindex) {
                                            payline[p]['value'] = row[element];
                                            payline[p]['updated'] = true;
                                        }
                                    }
                                    plinedataloadindex = findMultiIndexbyKeyVal("sourcefield", element, plinedata);
                                    if(plinedataloadindex.length > 0){
                                        for (let p of plinedataloadindex) {
                                            plinedata[p]['value'] = row[element];
                                            plinedata[p]['updated'] = true;
                                        }
                                    }
                                    plineacctloadindex = findMultiIndexbyKeyVal("sourcefield", element, plineacct);
                                    if(plineacctloadindex.length > 0){
                                        for (let p of plineacctloadindex) {
                                            plineacct[p]['value'] = row[element];
                                            plineacct[p]['updated'] = true;
                                        }
                                    }
                                }

                                if(isinvline){
                                    invlineloadindex = findMultiIndexbyKeyVal("sourcefield", element, invline);
                                    if(invlineloadindex.length > 0){
                                        for (let p of invlineloadindex) {
                                            invline[p]['value'] = row[element];
                                            invline[p]['updated'] = true;
                                        }
                                    }
                                    invlinedataloadindex = findMultiIndexbyKeyVal("sourcefield", element, invlinedata);                                 
                                    if(invlinedataloadindex.length > 0){
                                        for (let p of invlinedataloadindex) {                                            
                                            if(invlinedata[p]['valueifmatch'] == true){
                                                if(invlinedata[p]['lookupfield']){
                                                        invlinedata[p]['value'] = row[invlinedata[p]['lookupfield']]==invlinedata[p]['matchvalue'];
                                                        invlinedata[p]['updated'] = true;
                                                }
                                            }else{
                                                    invlinedata[p]['value'] = row[element];
                                                    invlinedata[p]['updated'] = true;
                                            }
                                        }
                                    }
                                }

                                if(isglline){
                                    gllineloadindex =  findMultiIndexbyKeyVal("sourcefield", element, glline);                                   
                                    if(gllineloadindex.length > 0){
                                        for (let p of gllineloadindex) {
                                            glline[p]['value'] = row[element];
                                            glline[p]['updated'] = true;
                                        }
                                    }   
                                    gllinedataloadindex = findMultiIndexbyKeyVal("sourcefield", element, gllinedata);
                                    if(gllinedataloadindex.length > 0){
                                        for (let p of gllinedataloadindex) {
                                            if(gllinedata[p]['valueifmatch'] == true){
                                                if(gllinedata[p]['lookupfield']){
                                                    gllinedata[p]['value'] = row[gllinedata[p]['lookupfield']]==gllinedata[p]['matchvalue'];
                                                    gllinedata[p]['updated'] = true;
                                                }
                                            }else{
                                                    gllinedata[p]['value'] = row[element];
                                                    gllinedata[p]['updated'] = true;
                                            }
                                        }
                                    }
                                    gllineitemloadindex = findMultiIndexbyKeyVal("sourcefield", element, gllineitem);
                                    if(gllineitemloadindex.length > 0){
                                        for (let p of gllineitemloadindex) {
                                            gllineitem[p]['value'] = row[element];
                                            gllineitem[p]['updated'] = true;
                                        }
                                    }
                                    gllineacctloadindex = findMultiIndexbyKeyVal("sourcefield", element, gllineacct);
                                    if(gllineacctloadindex.length > 0){
                                        for (let p of gllineacctloadindex) {
                                            gllineacct[p]['value'] = row[element];
                                            gllineacct[p]['updated'] = true;
                                        }
                                    }
                                }                              
                              
                            }
                    };

                    payintegate = null;
                    if(ispaymentline){
                        plinedata = format_payload(plinedata, null);
                        plineacct = format_payload(plineacct, null);
                        dataarray = [{'plinedata':plinedata, 'plineacct':plineacct}];
                        payline = format_payload(payline, dataarray);
                        payintegate = payline;
                    }
          
                    invintegrate = null;
                    if(isinvline){
                        invlinedata = format_payload(invlinedata, null);
                        dataarray = [{'invlinedata':invlinedata}];
                        invline  = format_payload(invlinedata, dataarray);
                        invintegrate = invline;  
                    }
                    
                    glintegrate = null;
                    if(isglline){
                        gllineitem = format_payload(gllineitem, null);
                        gllineacct = format_payload(gllineacct, null);
                        gllinedata = format_payload(gllinedata, null);
                        dataarray = [{'gllinedata':gllinedata, 'gllineitem':gllineitem, 'gllineacct':gllineacct}];
                        glline  = format_payload(glline, dataarray);
                        glintegrate = glline;
                    }
                    
                    dataarray = [{'payline':payintegate, 'invline':invintegrate, 'glline':glintegrate}];

                    /* This is the final payload for AR/AP */
                    payload = format_payload(payload, dataarray);

                }
    
            poolConnection.close();    
            res.send("End Run");
        } catch(err)
        {
            res.send(err);
        }
    });


   // Create a route that sends a response when visiting the homepage
   app.get('/', (req, res) => {
     res.send('<h1>Hello, Express.js Server!</h1>'+'\n');
   });  

   // Set up the server to listen on port 3000
   const port = 3000;
   app.listen(port, () => {
     console.log(`Server is running on port ${port}`);
   });
