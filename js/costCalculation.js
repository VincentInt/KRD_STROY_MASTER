const countElem = document.getElementById("cost_count");
const costTextTypeElem = document.getElementById("cost_text_type");
const costBtnElem = document.getElementById("cost_btn");
const costErrorElem = document.getElementById("cost_error");
const costBtnBack = (document.getElementById("cost_btn_back").onclick = () =>
  onMove(-1, "back"));
const costBtnNext = (document.getElementById("cost_btn_next").onclick = () =>
  onMove(1, "next"));

const datePrice = [
  [1000, 2000, 3000, 4000],
  [1000, 2000, 3000, 4000],
  [1000, 2000, 3000, 4000],
];
const dateType = [
  "Для какого объекта требуется ремонт?",
  "Какая площадь объекта?",
  "Когда планируете начать ремнот?",
];
const dateHTML = [
  {
    html: ` <button id="cost_btn_type 1" class="house">Дом</button>
            <button id="cost_btn_type 2" class="apartment">Квартира</button>
            <button id="cost_btn_type 3" class="office">Офис</button>
            <button id="cost_btn_type 4" class="com_premises">Коммерческое помещение</button>`,
    css: `  "house apartment office"
            "com_premises com_premises com_premises";`,
  },
  {
    html: ` <button id="cost_btn_type 1" class="squre do50">До 50 м</button>
            <button id="cost_btn_type 2" class="squre ot50do100">От 50 до 100 м</button>
            <button id="cost_btn_type 3" class="squre ot100do500">От 100 до 500 м</button>
            <button id="cost_btn_type 4" class="squre bolee500">Более 500 м</button>`,
    css: `  "do50 ot50do100 ot50do100"
            "ot100do500 ot100do500 bolee500"`,
  },
  {
    html: ` <button id="cost_btn_type 1" class="ranche">Сейчас</button>
            <button id="cost_btn_type 2" class="herez12m">Через 1-2мес</button>
            <button id="cost_btn_type 3" class="polgoda">В полугодии</button>
            <button id="cost_btn_type 4" class="herezgod">Через 1год</button>`,
    css: `  "ranche ranche  herez12"
            "polgoda  herezgod herezgod";`,
  },
];

let calculation = [];
let indexCost = 0;

function onMove(move, type) {
  let index = indexCost + move;
  if (index >= 0 && index <= dateHTML.length) {
    if (calculation[indexCost] !== undefined || type === "back") {
      costErrorElem.innerHTML = "";
      indexCost = index;
      render();
    } else {
      costErrorElem.innerHTML = "Вы нечего не выбрали";
    }
  }
}
function render() {
  if (indexCost > dateHTML.length - 1) {
    const num = calculation.reduce((acc, item, index) => {
      acc += datePrice[index][item];
      return acc;
    }, 0);
    countElem.innerHTML = `Рассчет`;
    costTextTypeElem.innerHTML = "Приблизительная стоимость ремонтных работ:";
    costBtnElem.innerHTML = `<h2 class="num">~ ${new Intl.NumberFormat(
      "ru"
    ).format(num)} ₽</h2>`;
    costBtnElem.style = `grid-template-areas: ". num ."`;
  } else {
    countElem.innerHTML = `${indexCost + 1}/${dateHTML.length}`;
    costTextTypeElem.innerHTML = dateType[indexCost];
    costBtnElem.innerHTML = dateHTML[indexCost].html;
    costBtnElem.style = `grid-template-areas: ${dateHTML[indexCost].css}`;

    dateHTML[indexCost].html
      .split("cost_btn_type")
      .slice(1)
      .forEach((_, index) => {
        const elem = document.getElementById(`cost_btn_type ${index + 1}`);
        elem.className =
          calculation[indexCost] === index
            ? `${elem.className}  active`
            : elem.className;
        elem.onclick = () => {
          calculation[indexCost] = index;
          render();
        };
      });
  }
}
render();
