import { Injectable } from "@angular/core";

@Injectable({ providedIn: "root" })
export class StockChartService {
  public toLocalString(value: string | number): string {
    if (typeof value === "string") {
      return parseInt(value).toLocaleString(undefined, {
        maximumFractionDigits: 2,
      });
    }

    return value.toLocaleString(undefined, {
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

  public setCustomTooltip(
    data: any,
    seriesIndex: number,
    chartType: "line" | "candles",
    isRealTime?: boolean
  ) {
    // for the volumes bar
    if (seriesIndex === 1) {
      if (data === 0) return "<span></span>";
      if (!isRealTime) {
        return `<div style="padding: 8px 12px">
                <b>Volumns</b>: ${data.y.toLocaleString()}
              </div>`;
      }
      return `<div style="padding: 8px 12px">
                <b>Volumns</b>: ${data.toLocaleString()}
              </div>`;
    }

    // for the candle bar
    if (chartType === "candles") {
      if (data.y[0] === -1) return "<span></span>";
      return `<div style="padding: 0px;"> 
          <div style="background-color: grey; padding: 6px 12px; text-align: center;">
            ${
              isRealTime
                ? new Date(data.y[4]).toLocaleTimeString()
                : new Date(data.y[4]).toLocaleString()
            }
          </div>
          <div style="padding: 4px 12px; text-align: center;">
            <b>Open</b>: ${this.toLocalString(data.y[0])} 
          </div> 
          <div style="padding: 4px 12px; text-align: center;">
            <b>High</b>: ${this.toLocalString(data.y[1])} 
          </div> 
          <div style="padding: 4px 12px; text-align: center;">
            <b>Low</b>: ${this.toLocalString(data.y[2])} 
          </div> 
          <div style="padding: 4px 12px; text-align: center;">
            <b>Close</b>: ${this.toLocalString(data.y[3])} 
          </div> 
        </div>`;
    } else {
      if (data.y === -1) return "<span></span>";
      return `<div style="padding: 0px;"> 
          <div style="background-color: grey; padding: 6px 12px; text-align: center;">
            ${
              isRealTime
                ? new Date(data.meta[4]).toLocaleTimeString()
                : new Date(data.meta[4]).toLocaleString()
            }
          </div>
          <div style="padding: 4px 12px; text-align: center;">
            <b>Open</b>: ${this.toLocalString(data.meta[0])} 
          </div> 
          <div style="padding: 4px 12px; text-align: center;">
            <b>High</b>: ${this.toLocalString(data.meta[1])} 
          </div> 
          <div style="padding: 4px 12px; text-align: center;">
            <b>Low</b>: ${this.toLocalString(data.meta[2])} 
          </div> 
          <div style="padding: 4px 12px; text-align: center;">
            <b>Close</b>: ${this.toLocalString(data.meta[3])} 
          </div> 
        </div>`;
    }
  }
}
