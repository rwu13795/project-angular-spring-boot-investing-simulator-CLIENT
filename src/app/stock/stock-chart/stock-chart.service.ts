import { Injectable } from "@angular/core";

@Injectable({ providedIn: "root" })
export class StockChartService {
  public toLocalString(value: string | number): string {
    if (typeof value === "string") {
      return parseInt(value).toLocaleString("en-US", {
        maximumFractionDigits: 2,
      });
    }

    return value.toLocaleString("en-US", {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    });
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

  public setCustomTooltip(data: any, seriesIndex: number) {
    // for the volumes bar
    if (seriesIndex === 1) {
      if (data === 0) return "<span></span>";
      return `<div style='padding: 8px'>
                <b>Volumns</b>: ${data.toLocaleString()}
              </div>`;
    }

    // for the candle bar
    if (data.y[0] === -1) return "<span></span>";
    return (
      "<div style='padding: 8px;'>" +
      "<div><b>Open</b>: " +
      this.toLocalString(data.y[0]) +
      "</div>" +
      "<div><b>High</b>: " +
      this.toLocalString(data.y[1]) +
      "</div>" +
      "<div><b>Low</b>: " +
      this.toLocalString(data.y[2]) +
      "</div>" +
      "<div><b>Close</b>: " +
      this.toLocalString(data.y[3]) +
      "</div>" +
      "</div>"
    );
  }
}
