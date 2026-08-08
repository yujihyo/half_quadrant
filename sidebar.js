/* =========================
   Sidebar
========================= */

function initSidebar() {

    const inputs = document.querySelectorAll(
        "#sidebar input"
    );


    inputs.forEach(input => {

        input.addEventListener(
            "input",
            () => {

                updatePreviewFromInput(input);

            }
        );

    });

}



/* =========================
   입력값 → Preview
========================= */

function updatePreviewFromInput(input) {

    const id = input.id;

    const value = input.value;


    const map = {

        "input-title":
            "preview-title",

        "input-axis-top":
            "axis-top",

        "input-axis-bottom":
            "axis-bottom",

        "input-axis-left":
            "axis-left",

        "input-axis-right":
            "axis-right",

        "input-quad-tl":
            "quad-tl",

        "input-quad-tr":
            "quad-tr",

        "input-quad-bl":
            "quad-bl",

        "input-quad-br":
            "quad-br"

    };


    const targetId = map[id];


    if (!targetId) return;


    const target =
        document.getElementById(targetId);


    if (!target) return;


    let displayValue = value;

    if (
        targetId === "axis-left" ||
        targetId === "axis-right"
    ) {

        if (value.length > 7) {

            const mid = Math.ceil(value.length / 2);

            displayValue =
                value.slice(0, mid) +
                "\n" +
                value.slice(mid);

        }

    }

    target.textContent = displayValue;

}



/* =========================
   Preview → Sidebar
========================= */

function updateSidebarInput(
    target,
    value
) {

    const map = {

        "title":
            "input-title",

        "axis-top":
            "input-axis-top",

        "axis-bottom":
            "input-axis-bottom",

        "axis-left":
            "input-axis-left",

        "axis-right":
            "input-axis-right",

        "quad-tl":
            "input-quad-tl",

        "quad-tr":
            "input-quad-tr",

        "quad-bl":
            "input-quad-bl",

        "quad-br":
            "input-quad-br"

    };


    const inputId =
        map[target];


    if (!inputId) return;


    const input =
        document.getElementById(inputId);


    if (!input) return;


    input.value = value;

}