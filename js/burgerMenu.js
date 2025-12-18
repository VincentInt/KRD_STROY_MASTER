const burgerMenuElem = document.getElementById("burger_menu");
const btnBurgerMenuElem = document.getElementById("btn_burger");

let statusOpen = false;

btnBurgerMenuElem.onclick = () => onClickBtn(!statusOpen);

function onClickBtn(status) {
  statusOpen = status;
  if (statusOpen) {
    burgerMenuElem.style.display = "flex";
    document.body.style.overflowY = "hidden";
    burgerMenuElem.onclick = (e) => {
      if (e.target === burgerMenuElem || e.target.localName === "a") {
        onClickBtn(false);
      }
    };
  } else {
    burgerMenuElem.style.display = "none";
    document.body.style.overflowY = "scroll";
  }
}
