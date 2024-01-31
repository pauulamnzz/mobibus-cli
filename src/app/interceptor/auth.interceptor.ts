import { HttpEvent, HttpHandler, HttpHandlerFn, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { SessionAjaxService } from "../services/session.ajax.service";
import { API_EMT } from "../environment/environment";







export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {

    if (!req.url.startsWith(API_EMT)) {
        // Inject the current `AuthService` and use it to get an authentication token:
        const token = inject(SessionAjaxService).getToken();
        //const authToken = inject(AuthService).getAuthToken();
        // Clone the request to add the authentication header.
        if (token) {
            const newReq = req.clone({
                headers: req.headers.set("Authorization", "Bearer " + token)
            });
            return next(newReq);
        } else {
            return next(req);
        }
 

    }else{
        return next(req);
    }

}