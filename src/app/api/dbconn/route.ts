
import {NextRequest, NextResponse } from "next/server";
import sql from 'mssql';



export const GET = async (request: any) => {
	return Response.json({"status" : 200});
}