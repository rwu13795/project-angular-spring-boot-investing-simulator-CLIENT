import { Injectable } from "@angular/core";

@Injectable({ providedIn: "root" })
export class StockChartService {
  public toLocalString(value: string | number): string {
    return value.toLocaleString("en-US");
  }

  public toSignificantDigit(value: number): string {
    if (value <= 0) return "0";

    // 1 billion
    if (value > 999999999) {
      return `${value / 1000000000}B`;
    } else if (value > 999999) {
      return `${value / 1000000}M`;
    } else {
      return `${value / 1000}K`;
    }
  }
}
