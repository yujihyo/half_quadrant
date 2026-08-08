/* =========================
   Main
========================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initSidebar();

        initPreview();

        initSave();

    }
);



/* =========================
   PNG 저장
========================= */

function initSave() {

    const button =
        document.getElementById(
            "save-button"
        );


    if (!button) return;


    button.addEventListener(
        "click",
        savePNG
    );

}



/* =========================
   PNG 생성
========================= */

async function savePNG() {

    const captureArea =
        document.getElementById(
            "capture-area"
        );


    if (!captureArea) return;


    const canvas =
        await html2canvas(
            captureArea,
            {
                width: 900,
                height: 900,

                scale: 2,

                backgroundColor: "#ffffff",

                useCORS: true,

                logging: false
            }
        );


    const link =
        document.createElement("a");


    link.download =
        "quadrant.png";


    link.href =
        canvas.toDataURL(
            "image/png"
        );


    link.click();

}

/* ===========================
   Sticker
=========================== */

const stickers = [];

window.addEventListener(

    "DOMContentLoaded",

    () => {

        initStickerManager();

    }

);