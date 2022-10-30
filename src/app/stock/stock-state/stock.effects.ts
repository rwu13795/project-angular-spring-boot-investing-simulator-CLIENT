import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { createEffect, ofType, Actions } from "@ngrx/effects";
import { map, catchError, switchMap, of, tap } from "rxjs";
import { environment } from "src/environments/environment";
import {
  Response_companyProfile,
  Response_priceChangePercentage,
} from "../stock-models";

import * as actions from "./stock.actions";

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable()
export class StockEffects {
  private SERVER_URL = environment.SERVER_URL;

  public fetchCompanyProfile = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.fetchCompanyProfile),
      switchMap(({ symbol }) => {
        const params = new HttpParams({
          fromObject: { symbol },
        });

        return this.http
          .get<Response_companyProfile[]>(`${this.SERVER_URL}/stock/profile`, {
            params,
          })
          .pipe(
            map((data) => {
              return actions.setCompanyProfile({ profile: data[0] });
            })
          );
      })
    )
  );

  public fetchPriceChangePercentage = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.fetchPriceChangePercentage),
      switchMap(({ symbol }) => {
        const params = new HttpParams({
          fromObject: { symbol },
        });

        return this.http
          .get<Response_priceChangePercentage[]>(
            `${this.SERVER_URL}/stock/price/price-change`,
            { params }
          )
          .pipe(
            map((data) => {
              return actions.setPriceChangePercentage({
                changePercentage: data[0],
              });
            })
          );
      })
    )
  );

  constructor(private actions$: Actions, private http: HttpClient) {}

  private getErrorMessage(errorRes: HttpErrorResponse): string {
    console.log("HttpErrorResponse------------->", errorRes);

    let errorMessage = "An unknown error occurred!";
    if (!errorRes.error || !errorRes.error.error) {
      return errorMessage;
    }

    switch (errorRes.error.error.message) {
      case "EMAIL_EXISTS": {
        errorMessage = "This email exists already";
        break;
      }
      case "INVALID_PASSWORD": {
        errorMessage = "The password you provided is not correct";
        break;
      }
      case "EMAIL_NOT_FOUND": {
        errorMessage = "The email you provided does not exist in our record";
        break;
      }

      default:
        break;
    }

    return errorMessage;
  }
}

/*

--- (1) --- 
There 4 types of special "map" operators in "rxjs"
switchMap - mergeMap - concatMap - exhaustMap    

---- READ ----
https://offering.solutions/blog/articles/2021/03/08/switchmap-mergemap-concatmap-exhaustmap-explained/

switchMap: emits values and is only interested in the very last one it sent. 
All the responses of the calls before get ignored.

concatMap: behaves like a queue: It stores all calls and sends one after another. 
If one is completed, the next one is being processed.

mergeMap: Also sends all requests, like concatMap but does not wait until the 
response is coming back. It sends them out as they come. But it 
receives every response and does not ignore something. The order 
here is not guaranteed.

exhaustMap: Emits the first request and ignores all future requests until the 
first one gets back. Then it is ready for a new one.


*/
