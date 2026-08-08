/* =========================
   Preview
========================= */

function initPreview() {

    const editableElements =
        document.querySelectorAll(
            ".editable-text"
        );


    editableElements.forEach(element => {

        element.addEventListener(
            "click",
            handleMobileEdit
        );

    });

}



/* ===========================
   모바일 텍스트 수정
=========================== */

function handleMobileEdit(event) {

    if (window.innerWidth > 800) {
        return;
    }


    const element =
        event.currentTarget;


    const target =
        element.dataset.target;


    if (!target) {
        return;
    }


    let currentValue =
        element.textContent;


    /*
     * 출처는 앞의 ⓒ를 제외하고
     * 실제 입력된 텍스트만 가져온다.
     */
    if (target === "source") {

        const sourceText =
            document.getElementById(
                "source-text"
            );

        currentValue =
            sourceText
                ? sourceText.textContent
                : "";

    }


    const newValue =
        window.prompt(
            "텍스트를 입력해주세요.",
            currentValue
        );


    if (newValue === null) {
        return;
    }


    const value =
        newValue.trim();


    let displayValue =
        value;


    if (
        target === "axis-left" ||
        target === "axis-right"
    ) {

        if (value.length > 7) {

            const mid =
                Math.ceil(
                    value.length / 2
                );

            displayValue =
                value.slice(0, mid) +
                "\n" +
                value.slice(mid);

        }

    }


    /*
     * 출처
     */

    if (target === "source") {

        const sourceText =
            document.getElementById(
                "source-text"
            );

        if (sourceText) {

            sourceText.textContent =
                value;

        }

    } else {

        element.textContent =
            displayValue;

    }


    updateSidebarInput(
        target,
        value
    );


    saveState();

}

/* ===========================
   Sticker Upload
=========================== */

function initStickerUpload() {

    const upload =
        document.getElementById(
            "stickerUpload"
        );

    if (!upload) return;

    upload.addEventListener(

        "change",

        handleStickerUpload

    );

}

/* ===========================
   Sticker Manager
=========================== */

function initStickerManager() {

    document
        .getElementById(
            "stickerPlus"
        )
        .addEventListener(
            "click",
            addStickerUpload
        );

    document
        .getElementById(
            "stickerMinus"
        )
        .addEventListener(
            "click",
            removeStickerUpload
        );

    document
        .querySelectorAll(
            ".stickerUpload"
        )
        .forEach(input => {

            input.dataset.uploadId =
                crypto.randomUUID();

            input.addEventListener(

                "change",

                handleStickerUpload

            );

        });

}

function bindStickerUploads() {

    document
        .querySelectorAll(".stickerUpload")
        .forEach(input => {

            input.onchange =
                handleStickerUpload;

        });

}

/* ===========================
   Add Sticker Upload
=========================== */

function addStickerUpload() {

    const container =
        document.getElementById(
            "stickerUploads"
        );

    const uploadId =
        crypto.randomUUID();

    const input =
        document.createElement(
            "input"
        );

    input.type = "file";

    input.accept =
        ".png,image/png";

    input.className =
        "stickerUpload";

    input.dataset.uploadId =
        uploadId;

    input.addEventListener(

        "change",

        handleStickerUpload

    );

    container.appendChild(
        input
    );

}

/* ===========================
   Remove Sticker Upload
=========================== */

function removeStickerUpload() {

    const container =
        document.getElementById(
            "stickerUploads"
        );

    const uploads =
        container.querySelectorAll(
            ".stickerUpload"
        );

    if (uploads.length === 0) {
        return;
    }

    const input =
        uploads[
        uploads.length - 1
        ];

    // 연결된 스티커 삭제
    if (input.dataset.stickerId) {

        const sticker =
            document.querySelector(
                `.sticker[data-id="${input.dataset.stickerId}"]`
            );

        if (sticker) {

            if (
                selectedSticker === sticker
            ) {
                selectedSticker = null;
            }

            sticker.remove();

        }

    }

    // 마지막 하나는 남겨둔다
    if (uploads.length === 1) {

        input.value = "";

        delete input.dataset.stickerId;

        saveState();

        return;

    }

    input.remove();

    saveState();

}


/* ===========================
   Upload
=========================== */

function handleStickerUpload(event) {

    const input =
        event.currentTarget;

    const file =
        input.files[0];

    if (!file) {
        return;
    }

    // 기존 스티커가 있으면 삭제
    if (input.dataset.stickerId) {

        const oldSticker =
            document.querySelector(
                `.sticker[data-id="${input.dataset.stickerId}"]`
            );

        if (oldSticker) {
            oldSticker.remove();
        }

        delete input.dataset.stickerId;

    }

    const reader =
        new FileReader();

    reader.onload = e => {

        const sticker =
            createSticker(
                e.target.result
            );

        const stickerId =
            crypto.randomUUID();

        sticker.dataset.id =
            stickerId;

        input.dataset.stickerId =
            stickerId;

        sticker.dataset.uploadId =
            input.dataset.uploadId;

        saveState();

    };

    reader.readAsDataURL(file);

}

/* ===========================
   Create Sticker
=========================== */

function createSticker(src) {

    const layer =
        document.getElementById(
            "stickerLayer"
        );

    const sticker =
        document.createElement("div");

    sticker.className =
        "sticker";

    sticker.style.left =
        "300px";

    sticker.style.top =
        "300px";

    const img =
        document.createElement("img");

    img.draggable = false;

    img.onload = () => {

        const MAX_SIZE = 180;

        let width =
            img.naturalWidth;

        let height =
            img.naturalHeight;

        const scale =
            Math.min(
                MAX_SIZE / width,
                MAX_SIZE / height,
                1
            );

        width *= scale;
        height *= scale;

        sticker.style.width =
            width + "px";

        sticker.style.height =
            height + "px";

    };

    img.src = src;

    sticker.appendChild(img);

    // ===== 삭제 버튼 =====

    const deleteButton =
        document.createElement("div");

    deleteButton.className =
        "delete-button";

    deleteButton.textContent =
        "×";

    deleteButton.addEventListener(

        "pointerdown",

        e => {

            e.stopPropagation();

        }

    );

    deleteButton.addEventListener(

        "click",

        () => {

            deleteSticker(
                sticker
            );

        }

    );

    sticker.appendChild(
        deleteButton
    );

    // ===== 핸들 =====

    [
        "tl",
        "tr",
        "bl",
        "br"
    ].forEach(type => {

        const handle =
            document.createElement(
                "div"
            );

        handle.className =
            "handle " + type;

        sticker.appendChild(
            handle
        );

    });

    layer.appendChild(
        sticker
    );

    enableStickerDrag(
        sticker
    );

    selectSticker(
        sticker
    );

    return sticker;

}

/* ===========================
   Delete Sticker
=========================== */

function deleteSticker(sticker) {

    if (!sticker) {
        return;
    }

    // 연결된 업로드 input 찾기
    const stickerId =
        sticker.dataset.id;

    const upload =
        document.querySelector(
            `.stickerUpload[data-sticker-id="${stickerId}"]`
        );

    // 업로드칸 삭제
    if (upload) {

        const container =
            document.getElementById(
                "stickerUploads"
            );

        if (
            container.children.length > 1
        ) {

            upload.remove();

        } else {

            upload.value = "";

            delete upload.dataset.stickerId;

        }

    }

    // 선택 해제
    if (
        selectedSticker === sticker
    ) {

        selectedSticker = null;

    }

    // 스티커 삭제
    sticker.remove();

    saveState();

}

/* ===========================
   Drag
=========================== */

/* ===========================
   Sticker Drag
=========================== */

function enableStickerDrag(sticker) {

    let startX = 0;
    let startY = 0;

    let originX = 0;
    let originY = 0;

    let dragging = false;

    sticker.addEventListener(
        "pointerdown",
        pointerDown
    );

    function pointerDown(e) {

        // 삭제 버튼은 드래그하지 않음
        if (
            e.target.classList.contains(
                "delete-button"
            )
        ) {
            return;
        }

        // 확대 핸들은 드래그하지 않음
        if (
            e.target.classList.contains(
                "handle"
            )
        ) {
            return;
        }

        e.preventDefault();
        e.stopPropagation();

        selectSticker(sticker);

        dragging = true;

        startX = e.clientX;
        startY = e.clientY;

        originX =
            parseFloat(sticker.style.left) || 0;

        originY =
            parseFloat(sticker.style.top) || 0;

        sticker.setPointerCapture(
            e.pointerId
        );

        window.addEventListener(
            "pointermove",
            pointerMove
        );

        window.addEventListener(
            "pointerup",
            pointerUp
        );

    }

    function pointerMove(e) {

        if (!dragging) {
            return;
        }

        const capture =
            document.getElementById(
                "capture-area"
            );

        const layer =
            document.getElementById(
                "stickerLayer"
            );

        // stickerLayer와 capture-area의 좌표 차이
        const layerRect =
            layer.getBoundingClientRect();

        const captureRect =
            capture.getBoundingClientRect();

        const offsetX =
            layerRect.left -
            captureRect.left;

        const offsetY =
            layerRect.top -
            captureRect.top;

        let x =
            originX +
            (e.clientX - startX);

        let y =
            originY +
            (e.clientY - startY);

        const maxX =
            capture.clientWidth -
            sticker.offsetWidth -
            offsetX;

        const maxY =
            capture.clientHeight -
            sticker.offsetHeight -
            offsetY;

        x = Math.max(
            -offsetX,
            Math.min(maxX, x)
        );

        y = Math.max(
            -offsetY,
            Math.min(maxY, y)
        );

        sticker.style.left =
            x + "px";

        sticker.style.top =
            y + "px";

    }

    function pointerUp() {

        dragging = false;

        window.removeEventListener(
            "pointermove",
            pointerMove
        );

        window.removeEventListener(
            "pointerup",
            pointerUp
        );

        saveState();

    }

}

/* ===========================
   Select Sticker
=========================== */

let selectedSticker = null;

let stickerZIndex = 1;

function selectSticker(sticker) {

    if (!sticker) {
        return;
    }

    // 이전 선택 해제
    if (
        selectedSticker &&
        selectedSticker !== sticker
    ) {

        selectedSticker.classList.remove(
            "selected"
        );

    }

    selectedSticker = sticker;

    sticker.classList.add(
        "selected"
    );

    // 항상 맨 앞으로
    sticker.style.zIndex =
        ++stickerZIndex;

}

document
    .getElementById("capture-area")
    .addEventListener(

        "pointerdown",

        e => {

            // 스티커 클릭이면 해제하지 않음
            if (
                e.target.closest(".sticker")
            ) {
                return;
            }

            if (selectedSticker) {

                selectedSticker.classList.remove(
                    "selected"
                );

                selectedSticker = null;

            }

        }

    );


/* ===========================
   Sticker Resize
=========================== */

enableStickerResize();

function enableStickerResize() {

    document.addEventListener(

        "pointerdown",

        resizeStart

    );

}

let resizingSticker = null;

let resizeStartX = 0;

let startWidth = 0;

let aspectRatio = 1;

function resizeStart(e) {

    if (
        !e.target.classList.contains("br")
    ) {
        return;
    }

    e.stopPropagation();

    resizingSticker =
        e.target.parentElement;

    resizeStartX =
        e.clientX;

    startWidth =
        resizingSticker.offsetWidth;

    aspectRatio =
        resizingSticker.offsetWidth /
        resizingSticker.offsetHeight;

    window.addEventListener(
        "pointermove",
        resizeMove
    );

    window.addEventListener(
        "pointerup",
        resizeEnd
    );

}

function resizeMove(e) {

    if (!resizingSticker) {
        return;
    }

    const diff =
        e.clientX -
        resizeStartX;

    let newWidth =
        startWidth +
        diff;

    newWidth =
        Math.max(
            40,
            Math.min(
                500,
                newWidth
            )
        );

    resizingSticker.style.width =
        newWidth + "px";

    resizingSticker.style.height =
        (
            newWidth /
            aspectRatio
        ) + "px";

}

function resizeEnd() {

    resizingSticker = null;

    window.removeEventListener(
        "pointermove",
        resizeMove
    );

    window.removeEventListener(
        "pointerup",
        resizeEnd
    );

    saveState();

}

/* ===========================
   Source Credit
=========================== */

function initSourceCredit() {

    const input =
        document.getElementById(
            "source-input"
        );

    const preview =
        document.getElementById(
            "source-text"
        );

    if (!input || !preview) {
        return;
    }

    input.addEventListener(
        "input",
        () => {

            preview.textContent =
                input.value;

            saveState();

        }
    );

}

/* ===========================
   Mobile Sticker Upload
=========================== */

function initMobileStickerUpload() {

    const button =
        document.getElementById(
            "mobile-sticker-add"
        );

    const input =
        document.getElementById(
            "mobile-sticker-upload"
        );

    if (!button || !input) {
        return;
    }


    button.addEventListener(
        "click",
        () => {

            input.click();

        }
    );


    input.addEventListener(
        "change",
        event => {

            const file =
                event.target.files[0];

            if (!file) {
                return;
            }


            const reader =
                new FileReader();


            reader.onload = e => {

                createSticker(
                    e.target.result
                );

                saveState();

            };


            reader.readAsDataURL(file);


            /*
             * 같은 파일을 다시 선택해도
             * change 이벤트가 발생하도록 초기화
             */
            input.value = "";

        }
    );

}