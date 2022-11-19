import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AbstractControl } from "@angular/forms";
import { map, catchError, of } from "rxjs";
import { environment } from "src/environments/environment";
import { Response_realTimePrice } from "../stock/stock-models";
import {
  InputField,
  InputFieldNames,
  Response_checkAuth,
  Response_transactions,
  Response_transactionsCount,
} from "./user-models";

@Injectable({ providedIn: "root" })
export class UserService {
  private SERVER_URL = environment.SERVER_URL;

  constructor(private http: HttpClient) {}

  public checkAuth() {
    return this.http.get<Response_checkAuth>(
      `${this.SERVER_URL}/auth/check-auth`,
      { withCredentials: true }
    );
  }

  public getAssetTransactions(
    symbol: string,
    pageNum: number,
    type: "holding" | "short-selling"
  ) {
    const params = new HttpParams({
      fromObject: { symbol, pageNum, type },
    });
    return this.http.get<Response_transactions>(
      `${this.SERVER_URL}/portfolio/transaction/by-page`,
      { withCredentials: true, params }
    );
  }

  public getAssetTransactionsCount(
    symbol: string,
    type: "holding" | "short-selling"
  ) {
    const params = new HttpParams({
      fromObject: { symbol, type },
    });
    return this.http.get<Response_transactionsCount>(
      `${this.SERVER_URL}/portfolio/transaction/count`,
      { withCredentials: true, params }
    );
  }

  public getWatchlistByPage_withPrice(pageNum: number) {
    const params = new HttpParams({
      fromObject: { pageNum },
    });
    return this.http.get<Response_realTimePrice[]>(
      `${this.SERVER_URL}/portfolio/watchlist/by-page-with-price`,
      { withCredentials: true, params }
    );
  }

  public removeFromWatchlist_batch(symbols: string[]) {
    return this.http.post(
      `${this.SERVER_URL}/portfolio/watchlist/batch`,
      { symbols },
      { withCredentials: true }
    );
  }

  public toFixedLocale(
    number: number,
    showZero: boolean = false,
    decimal: number = 2
  ) {
    if (number === 0) return showZero ? 0 : "-";
    const temp = number >= 0 ? number : number * -1;
    return temp.toLocaleString(undefined, {
      minimumFractionDigits: decimal,
      maximumFractionDigits: decimal,
    });
  }

  public setInputErrorMessage(
    field: string,
    inputError: InputField,
    control: AbstractControl
  ) {
    if (control.errors) {
      // console.log(control.errors);
      if (control.errors["maxlength"]) {
        switch (field) {
          case InputFieldNames.email: {
            inputError[field] =
              "The email must be less than or equal to 30 characters";
            return;
          }
          case InputFieldNames.password:
          case InputFieldNames.confirm_password: {
            inputError[field] =
              "Password must be between 8 and 20 characters in length";
            return;
          }
          default:
            return;
        }
      }
      if (control.errors["minlength"]) {
        inputError[field] =
          "Password must be between 8 and 20 characters in length";
        return;
      }
      if (control.errors["email"]) {
        inputError[field] = "Invalid email";
        return;
      }
      if (control.errors["required"]) {
        inputError[field] = "Required field";
        return;
      }
    } else {
      inputError[field] = "";
    }
  }
}
