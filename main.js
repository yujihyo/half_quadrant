/* ===========================
   Session Storage
=========================== */

const STORAGE_KEY =
    "half_quadrant";


/* ===========================
   Save State
=========================== */

function saveState() {

    const getInputValue =
        id => {

            const input =
                document.getElementById(id);

            if (!input) {
                return "";
            }

            return input.value;

        };


    const data = {

        /* =====================
           Sidebar Text
        ===================== */

        title:
            getInputValue(
                "input-title"
            ),

        axisTop:
            getInputValue(
                "input-axis-top"
            ),

        axisBottom:
            getInputValue(
                "input-axis-bottom"
            ),

        axisLeft:
            getInputValue(
                "input-axis-left"
            ),

        axisRight:
            getInputValue(
                "input-axis-right"
            ),

        quadTL:
            getInputValue(
                "input-quad-tl"
            ),

        quadTR:
            getInputValue(
                "input-quad-tr"
            ),

        quadBL:
            getInputValue(
                "input-quad-bl"
            ),

        quadBR:
            getInputValue(
                "input-quad-br"
            ),


        /* =====================
           Source
        ===================== */

        source:
            getInputValue(
                "source-input"
            ),


        /* =====================
           Stickers
        ===================== */

        stickers: []

    };


    /* =========================
       Sticker Save
    ========================= */

    document
        .querySelectorAll(
            ".sticker"
        )
        .forEach(sticker => {

            const img =
                sticker.querySelector(
                    "img"
                );

            if (!img) {
                return;
            }


            data.stickers.push({

                src:
                    img.src,

                left:
                    parseFloat(
                        sticker.style.left
                    ) || 0,

                top:
                    parseFloat(
                        sticker.style.top
                    ) || 0,

                width:
                    sticker.offsetWidth,

                height:
                    sticker.offsetHeight

            });

        });


    /* =========================
       Session Storage
    ========================= */

    sessionStorage.setItem(

        STORAGE_KEY,

        JSON.stringify(data)

    );

}

/* ===========================
   Load State
=========================== */

function loadState() {

    const raw =
        sessionStorage.getItem(
            STORAGE_KEY
        );

    /*
     * 저장된 데이터가 없다면
     * 아무것도 건드리지 않는다.
     *
     * HTML에 작성해 둔 초기 화면을 그대로 사용한다.
     */
    if (!raw) {
        return;
    }


    let data;

    try {

        data = JSON.parse(raw);

    } catch (error) {

        console.error(
            "저장된 데이터를 불러오지 못했습니다.",
            error
        );

        return;

    }


    /* =========================
       Preview Text
    ========================= */

    const previewMap = {

        title:
            "preview-title",

        axisTop:
            "axis-top",

        axisBottom:
            "axis-bottom",

        axisLeft:
            "axis-left",

        axisRight:
            "axis-right",

        quadTL:
            "quad-tl",

        quadTR:
            "quad-tr",

        quadBL:
            "quad-bl",

        quadBR:
            "quad-br"

    };


    Object.keys(previewMap).forEach(
        key => {

            const element =
                document.getElementById(
                    previewMap[key]
                );

            if (!element) {
                return;
            }


            /*
             * 중요:
             *
             * undefined인 경우에만 건너뛴다.
             *
             * "" 빈 문자열은 그대로 복원한다.
             */
            if (
                data[key] !== undefined
            ) {

                element.textContent =
                    data[key];

            }

        }
    );


    /* =========================
       Source
    ========================= */

    const sourceText =
        document.getElementById(
            "source-text"
        );

    if (
        sourceText &&
        data.source !== undefined
    ) {

        sourceText.textContent =
            data.source;

    }


    /* =========================
       Sidebar Text
    ========================= */

    const sidebarMap = {

        title:
            "input-title",

        axisTop:
            "input-axis-top",

        axisBottom:
            "input-axis-bottom",

        axisLeft:
            "input-axis-left",

        axisRight:
            "input-axis-right",

        quadTL:
            "input-quad-tl",

        quadTR:
            "input-quad-tr",

        quadBL:
            "input-quad-bl",

        quadBR:
            "input-quad-br",

        source:
            "source-input"

    };


    Object.keys(sidebarMap).forEach(
        key => {

            const input =
                document.getElementById(
                    sidebarMap[key]
                );

            if (!input) {
                return;
            }


            /*
             * 저장 데이터에 해당 항목이
             * 존재하는 경우에만 복원한다.
             *
             * ""도 정상적인 저장값이다.
             */
            if (
                data[key] !== undefined
            ) {

                input.value =
                    data[key];


                /*
                 * 저장된 값이 비어 있으면
                 * default 상태.
                 *
                 * 값이 있으면 사용자가 입력한 상태.
                 */
                if (
                    input.value === ""
                ) {

                    input.classList.add(
                        "default-value"
                    );

                    input.classList.remove(
                        "user-value"
                    );

                } else {

                    input.classList.remove(
                        "default-value"
                    );

                    input.classList.add(
                        "user-value"
                    );

                }

            }

        }
    );


    /* =========================
       Sticker Layer
    ========================= */

    const layer =
        document.getElementById(
            "stickerLayer"
        );

    if (!layer) {
        return;
    }


    /*
     * 기존 스티커 제거
     */
    layer
        .querySelectorAll(
            ".sticker"
        )
        .forEach(
            sticker => {
                sticker.remove();
            }
        );


    selectedSticker = null;


    /* =========================
       Sticker Restore
    ========================= */

    if (
        !Array.isArray(
            data.stickers
        )
    ) {

        return;

    }


    data.stickers.forEach(
        stickerData => {

            if (!stickerData.src) {
                return;
            }


            const sticker =
                createSticker(
                    stickerData.src
                );


            if (!sticker) {
                return;
            }


            /* 위치 */

            if (
                Number.isFinite(
                    stickerData.left
                )
            ) {

                sticker.style.left =
                    stickerData.left + "px";

            }


            if (
                Number.isFinite(
                    stickerData.top
                )
            ) {

                sticker.style.top =
                    stickerData.top + "px";

            }


            /* 크기 */

            if (
                Number.isFinite(
                    stickerData.width
                ) &&
                Number.isFinite(
                    stickerData.height
                )
            ) {

                sticker.style.width =
                    stickerData.width + "px";

                sticker.style.height =
                    stickerData.height + "px";

            }

        }
    );


    /*
     * 복원 직후에는 선택 상태를 없앤다.
     */
    if (selectedSticker) {

        selectedSticker.classList.remove(
            "selected"
        );

        selectedSticker = null;

    }

}

/* ===========================
   Clear State
=========================== */

function clearState() {

    sessionStorage.removeItem(
        STORAGE_KEY
    );

}


const stickers = [];

/* =========================
   Main
========================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initSidebar();

        initPreview();

        initSave();

        initStickerManager();

        initMobileStickerUpload();

        initSourceCredit();

        loadState();

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
