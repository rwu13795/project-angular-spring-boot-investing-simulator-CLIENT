import {
  trigger,
  state,
  style,
  transition,
  animate,
} from "@angular/animations";

export const newsAnimation = trigger("news", [
  state(
    "in",
    style({
      opacity: 1,
      transform: "translateY(0)",
    })
  ),
  // use "void" as the state for the element that has yet to be added
  transition("void => *", [
    style({
      opacity: 0,
      transform: "translateY(200px)",
    }),
    animate("1s"),
  ]),
]);
