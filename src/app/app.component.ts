import { Component, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  title = "client";

  @ViewChild("formRef") form!: NgForm;
  digit = "0";

  changeDigit() {
    // this.form.value;
    console.log("this.form.value;: ", this.form.value);
    this.digit = this.form.value.digit;

    console.log(this.digit);
  }
}
