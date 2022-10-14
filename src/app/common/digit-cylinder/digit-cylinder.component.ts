import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from "@angular/core";

@Component({
  selector: "app-digit-cylinder",
  templateUrl: "./digit-cylinder.component.html",
  styleUrls: ["./digit-cylinder.component.css"],
})
export class DigitCylinderComponent implements OnInit, OnChanges {
  @Input() digit: number = 0;

  ngOnInit(): void {
    console.log(this.digit);
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes["digit"].currentValue);

    let newNum = changes["digit"].currentValue;
    let cylinder = document.getElementById("cylinder");
    if (cylinder) {
      console.log(cylinder);
      let distance = cylinder.offsetHeight / 10;

      cylinder.style.transform = `translateY(${distance * newNum}px)`;
    }
  }

  // onInputChange(event: any) {
  //   let input = event.target as HTMLInputElement;

  //   if (this.inputTimer) clearTimeout(this.inputTimer);

  //   // after each user input change, set a 800ms timer to wait and see if user
  //   // is still entering input. If there is new input, the old timer will be
  //   // cleared and new timer will be created. If there is no input change
  //   // after 800ms, then trigger the callback (send http request and etc...)
  //   this.inputTimer = setTimeout(() => {
  //     console.log("input stop:", input.value);
  //     // send http request to make the search
  //   }, 800);
  // }
}
