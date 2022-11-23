import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AbstractControl } from "@angular/forms";
import { environment } from "src/environments/environment";
import { Response_realTimePrice } from "../stock/stock-models";
import {
  InputField,
  InputFieldNames,
  ResetPasswordBody,
  Response_checkAuth,
  Response_transaction,
  Response_transactionCount,
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
    type: "long" | "short"
  ) {
    const params = new HttpParams({
      fromObject: { symbol, pageNum, type },
    });
    return this.http.get<Response_transaction[]>(
      `${this.SERVER_URL}/portfolio/transaction/by-page`,
      { withCredentials: true, params }
    );
  }

  public getAssetTransactionsCount(symbol: string, type: "long" | "short") {
    const params = new HttpParams({
      fromObject: { symbol, type },
    });
    return this.http.get<Response_transactionCount>(
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

  public getResetPasswordLink(email: string) {
    return this.http.post(`${this.SERVER_URL}/auth/reset-password-request`, {
      email,
    });
  }

  public validateResetToken(token: string) {
    return this.http.post<{ timestamp: string; email: string }>(
      `${this.SERVER_URL}/auth/reset-password`,
      { token }
    );
  }

  public resetPassword(body: ResetPasswordBody) {
    return this.http.put(`${this.SERVER_URL}/auth/reset-password`, body);
  }

  public toFixedLocale({
    number,
    showZero = false,
    decimal = 2,
    addSymbol = false,
    addDollarSign = false,
  }: {
    number: number;
    showZero?: boolean;
    decimal?: number;
    addSymbol?: boolean;
    addDollarSign?: boolean;
  }) {
    if (number === 0) return showZero ? 0 : "-";

    if (!addSymbol) {
      return number.toLocaleString(undefined, {
        minimumFractionDigits: decimal,
        maximumFractionDigits: decimal,
      });
    }
    const tempNum = number >= 0 ? number : number * -1;
    let numString = tempNum.toLocaleString(undefined, {
      minimumFractionDigits: decimal,
      maximumFractionDigits: decimal,
    });
    if (addDollarSign) numString = "$" + numString;

    if (number > 0) numString = "+" + numString;
    if (number < 0) numString = "-" + numString;

    return numString;
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
