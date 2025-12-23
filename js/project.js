import dataSlider from "./data/project.json" with { type: "json" };
import dataModalSlider from "./data/project.json" with { type: "json" }

const containerProjects = document.getElementById("container_projects");

const modalWindowElem = document.getElementById("modal_window");
const imgModalWindowElem = document.getElementById("img_modal_window");
const closeBtnModalWindowElem = document.getElementById("close_modal");
const leftBtnModalWindowElem = document.getElementById("left_modal_btn");
const rigthBtnModalWindowElem = document.getElementById("rigth_modal_btn");

closeBtnModalWindowElem.onclick = () => {
  statusModalOpen = false;
  indexProjectModal = null;
  onModal();
};
leftBtnModalWindowElem.onclick = () => onMoveModalSlider(-1);
rigthBtnModalWindowElem.onclick = () => onMoveModalSlider(1);

const sliderElements = {};
const countSlideElements = {};

let indexLoad = 1;
let statusModalOpen = false;
let indexProjectModal = null;

function renderImg() {
  const indexSlide = dataModalSlider[indexProjectModal].indexSlide;
  const slides = dataModalSlider[indexProjectModal].slider;
  imgModalWindowElem.attributes[1].value = slides[indexSlide];
}
function onMoveModalSlider(move) {
  const dataModal = dataModalSlider[indexProjectModal];
  const indexSlide = dataModal.indexSlide + move;

  if (indexSlide < 0) {
    dataModalSlider[indexProjectModal].indexSlide = dataModal.slider.length - 1;
  } else if (indexSlide >= dataModal.slider.length) {
    dataModalSlider[indexProjectModal].indexSlide = 0;
  } else {
    dataModalSlider[indexProjectModal].indexSlide = indexSlide;
  }
  renderImg();
}
function onModal() {
  if (statusModalOpen && indexProjectModal !== null) {
    document.body.style.overflowY = "hidden";
    document.body.style.WebkitOverflowScrolling = "auto";
    modalWindowElem.style.display = "flex";
    history.pushState({ modal: true }, "", "#modal-open");
  } else {
    document.body.style.overflowY = "scroll";
    document.body.style.WebkitOverflowScrolling = "";
    modalWindowElem.style.display = "none";
  }
  renderImg();
}
function onMoreBtn(def = (indexLoad += 1)) {
  indexLoad = def;
  renderProject();
}
function sliderMove(move, index) {
  const project = dataSlider[index];
  const movePage = project.indexSlide + move;

  if (movePage < 0) {
    project.indexSlide = project.slider.length - 1;
  } else if (movePage >= project.slider.length) {
    project.indexSlide = 0;
  } else {
    project.indexSlide = movePage;
  }

  renderMoveSlide(index);
}
function goToSlide(index, slideNumber) {
  dataSlider[index].indexSlide = slideNumber;
  renderMoveSlide(index);
}
function renderMoveSlide(index) {
  const project = dataSlider[index];

  if (sliderElements[index]) {
    const img = sliderElements[index].querySelector("img");
    if (img) {
      img.src = project.slider[project.indexSlide];
      img.alt = `Проект: ${project.name} - фото ${project.indexSlide + 1}`;
    }
  }
  if (countSlideElements[index]) {
    const thumbnails = countSlideElements[index].querySelectorAll("button");
    thumbnails.forEach((thumb, thumbIndex) => {
      if (thumbIndex === project.indexSlide) {
        thumb.classList.add("active");
        thumb.setAttribute("aria-current", "true");
      } else {
        thumb.classList.remove("active");
        thumb.removeAttribute("aria-current");
      }
    });
  }
}
function onClickMove(e) {
  const btnSlider = e.target.closest(".slider-btn");
  const btnSize = e.target.closest(".btn_size");

  if (btnSlider) {
    const index = parseInt(btnSlider.getAttribute("data-index"));
    const actionSlider = btnSlider.getAttribute("data-action");

    if (actionSlider === "prev") {
      sliderMove(-1, index);
    } else if (actionSlider === "next") {
      sliderMove(1, index);
    }
  }
  if (btnSize) {
    const index = parseInt(btnSize.getAttribute("data-index"));
    const actionSize = btnSize.getAttribute("data-action");
    if (actionSize === "size") {
      statusModalOpen = true;
      indexProjectModal = index;
      onModal();
    }
  }

  const thumbnailBtn = e.target.closest(".thumbnail-btn");
  if (thumbnailBtn) {
    const sliderIndex = parseInt(
      thumbnailBtn.getAttribute("data-slider-index")
    );
    const slideNumber = parseInt(
      thumbnailBtn.getAttribute("data-slide-number")
    );
    goToSlide(sliderIndex, slideNumber);
  }
}
function onKeyDownMove(e) {
  if (e.key === "Enter" || e.key === " ") {
    const thumbnailBtn = e.target.closest(".thumbnail-btn");
    if (thumbnailBtn) {
      e.preventDefault();
      const sliderIndex = parseInt(
        thumbnailBtn.getAttribute("data-slider-index")
      );
      const slideNumber = parseInt(
        thumbnailBtn.getAttribute("data-slide-number")
      );
      goToSlide(sliderIndex, slideNumber);
    }
  }
}
function renderProject() {
  containerProjects.innerHTML = "";
  containerProjects.removeEventListener("click", onClickMove);
  containerProjects.removeEventListener("keydown", onKeyDownMove);
  dataSlider.forEach((item, index) => {
    if (indexLoad * 2 < index + 1) {
      if (dataSlider.length - 1 === index) {
        containerProjects.insertAdjacentHTML(
          "beforeend",
          `<div class="container_btn_more">
            <button id="btn_more">
              <h6>Показать еще</h6>
              <img src="/img/icon/icons8-back-50.png"/>
            </button>
           </div>`
        );
        document.getElementById("btn_more").onclick = () => onMoreBtn();
      }
      return;
    }
    const thumbnailsHTML = item.slider
      .map(
        (img, i) => `
        <button 
          class="thumbnail-btn ${i === 0 ? "active" : ""}" 
          data-slider-index="${index}"
          data-slide-number="${i}"
          aria-label="Перейти к фото ${i + 1}"
          ${i === 0 ? 'aria-current="true"' : ""}
        >
          <img 
            src="${img}" 
            alt="Миниатюра ${i + 1}" 
            loading="lazy"
          />
        </button>`
      )
      .join("");

    containerProjects.insertAdjacentHTML(
      "beforeend",
      `<div class="item_projects" data-index="${index}">
          <div class="container_page">
          <div class="btn_magnifying_glass">
            <button class="btn_size" data-action="size" data-index="${index}">
              <img src="./img/icon/icons8-лупа-78.png" alt="size_img" />
            </button>
          </div>
            <div class="container_btn">
              <button class="slider-btn" data-action="prev" data-index="${index}" aria-label="Предыдущее фото">
                <img src="./img/icon/icons8-back-50.png" alt="Назад" />
              </button>
              <button class="slider-btn" data-action="next" data-index="${index}" aria-label="Следующее фото">
                <img src="./img/icon/icons8-forward-50.png" alt="Вперёд" />
              </button>
            </div>
            <div class="container_count_slide" >
              <div id="count_slide_${index}" class="count_slide">         
                ${thumbnailsHTML}
              </div>
            </div>
            <div class="container_overflow">
              <div class="container_img" id="slider_${index}">
                <img
                  src="${item.slider[item.indexSlide]}"
                  alt="Проект: ${item.name}"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
          <div class="container_text">
            <h2>${item.name}</h2>
            <div class="container_param">
              <div>
              <div class="container_img">
                <img src="./img/icon/icons8-стоп-32.png" alt="square_img"/>
                   </div>
                   <h3>${item.square} м</h3>
              </div>
              <div>
                 <div class="container_img">
                <img src="./img/icon/icons8-пустые-песочные-часы-50.png" alt="square_img"/>
                </div>
                <h3>${item.time}</h3>
              </div>
              <div>
                <div class="container_img">
                <img src="./img/icon/icons8-корпоративная-ставка-64.png" alt="square_img"/>
                </div>
                <h3>${item.tariff}</h3>
              </div>
            </div>
           <ul>
              ${item.work
                .split(".")
                .filter((item) => item.length > 1)
                .map((item) => {
                  return `<li>${item}</li>`;
                })
                .join("")}
          </ul>
          </div>
        </div>`
    );

    sliderElements[index] = document.getElementById(`slider_${index}`);
    countSlideElements[index] = document.getElementById(`count_slide_${index}`);
  });

  containerProjects.addEventListener("click", onClickMove);
  containerProjects.addEventListener("keydown", onKeyDownMove);
  if (indexLoad * 2 > dataSlider.length && dataSlider.length > 2) {
    containerProjects.insertAdjacentHTML(
      "beforeend",
      `<div class="container_btn_more">
            <button class="back" id="btn_more">
              <h6>Свернуть</h6>
              <img src="./img/icon/icons8-back-50.png"/>
            </button>
           </div>`
    );
    document.getElementById("btn_more").onclick = () => onMoreBtn(1);
  }
}
document.addEventListener("DOMContentLoaded", renderProject);
let autoSlideInterval = null;
function startAutoSlide(interval = 10000) {
  stopAutoSlide();
  autoSlideInterval = setInterval(() => {
    dataSlider.forEach((_, index) => {
      sliderMove(1, index);
    });
  }, interval);
}
function stopAutoSlide() {
  if (autoSlideInterval) {
    clearInterval(autoSlideInterval);
    autoSlideInterval = null;
  }
}
containerProjects.addEventListener("mouseenter", stopAutoSlide);
containerProjects.addEventListener("mouseleave", () => startAutoSlide(10000));

setTimeout(() => startAutoSlide(10000), 1000);
