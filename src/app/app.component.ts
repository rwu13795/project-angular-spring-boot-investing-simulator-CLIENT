import { Component, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  title = "client";

  digitsString: string[] = ["9", "9", "9", ".", "9", "9"];
  newDigitsString: string[] = ["9", "9", "9", ".", "9", "9"];

  changeDigit(num: number) {
    this.digitsString = this.newDigitsString;
    this.newDigitsString = [...num.toFixed(2).toString()];

    console.log("old", this.digitsString);
    console.log("new", this.newDigitsString);
  }
}
