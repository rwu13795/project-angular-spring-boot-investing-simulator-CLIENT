import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from "@angular/core";

@Component({
  selector: "app-digit-slide",
  templateUrl: "./digit-slide.component.html",
  styleUrls: ["./digit-slide.component.css"],
})
export class DigitSlideComponent implements OnInit, OnChanges {
  @Input() digit: number = 0;

  inputTimer?: any;

  ngOnInit(): void {
    console.log(this.digit);
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes["digit"].currentValue);

    let newNum = changes["digit"].currentValue;
    let slide = document.getElementById("slide");
    if (slide) {
      console.log(slide);
      let slideDistance = slide.offsetHeight / 10;

      slide.style.transform = `translateY(${slideDistance * newNum}px)`;
    }
  }

  onInputChange(event: any) {
    let input = event.target as HTMLInputElement;

    if (this.inputTimer) clearTimeout(this.inputTimer);

    // after each user input change, set a 800ms timer to wait and see if user
    // is still entering input. If there is new input, the old timer will be
    // cleared and new timer will be created. If there is no input change
    // after 800ms, then trigger the callback (send http request and etc...)
    this.inputTimer = setTimeout(() => {
      console.log("input stop:", input.value);
      // send http request to make the search
    }, 800);
  }
}
