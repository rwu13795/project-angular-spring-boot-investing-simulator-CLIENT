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
}
