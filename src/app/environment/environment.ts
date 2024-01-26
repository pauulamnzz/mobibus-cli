import { HttpHeaders } from "@angular/common/http";

export const API_URL: string = 'http://localhost:8083';
export const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=UTF-8'
    }),
    withCredentials: true 
};


export const API_EMT: string = 'https://valencia.opendatasoft.com/api/explore/v2.1/catalog/datasets/emt/records?limit=20';
    withCredentials: true 
