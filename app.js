const image = document.querySelector(".blue");

const scrollDiv = document.querySelector("#scroll");

let clicking = false;
let previousX;
let previousY;

let determinantDimension;
let recessiveDimension;

const findDeterminantDimension = () => {
    const isHeightLarger = ((window.innerWidth / window.innerHeight)
        > (image.naturalWidth / image.naturalHeight));

    determinantDimension = isHeightLarger ? "height" : "width";
    recessiveDimension = isHeightLarger ? "width" : "height";
}

const containImageInWindow = () => {
    image.style[determinantDimension] = "100%";
    image.style[recessiveDimension] = "auto";
}

image.onload = () => {
    findDeterminantDimension();
    containImageInWindow();
};
window.addEventListener("resize", () => {
    findDeterminantDimension();
    containImageInWindow()
});

const zoom = (x, y, zoomAmount) => {
    const { scrollLeft, scrollTop } = scrollDiv;
    // Compute zoom logic
    const currentZoom = image.style[determinantDimension].slice(0, -1);
    const newZoom = Math.min(1000, Math.max(currentZoom * zoomAmount, 100));
    const zoomRatio = newZoom / currentZoom;
    // Zoom in/out
    image.style[determinantDimension] = `${newZoom}%`
    // Rescroll image
    scrollDiv.scrollLeft = ((scrollLeft + x) * zoomRatio) - x;
    scrollDiv.scrollTop = ((scrollTop + y) * zoomRatio) - y;
}

document.querySelector("#zoom").addEventListener("click", () => {
    zoom(window.innerWidth / 2, window.innerHeight / 2, 1.05)
})

document.addEventListener("wheel", (e) => {
    if (!e.shiftKey) {
        return;
    }
    zoom(e.clientX, e.clientY, Math.sign(e.deltaY) < 0 ? 1.05 : 1 / 1.05,)
});


image.addEventListener("dblclick", (e) => {
    image.style[determinantDimension] = "100%";
});


scrollDiv.addEventListener("mousedown", (e) => {
    e.preventDefault();
    previousX = e.clientX;
    previousY = e.clientY;
    clicking = true;
});

document.addEventListener("mouseup", (e) => {
    clicking = false;
});

scrollDiv.addEventListener("mousemove", (e) => {
    if (clicking) {
        e.preventDefault();
        scrollDiv.scrollLeft = scrollDiv.scrollLeft + (previousX - e.clientX);
        scrollDiv.scrollTop = scrollDiv.scrollTop + (previousY - e.clientY);
        previousX = e.clientX;
        previousY = e.clientY;
    }
});



scrollDiv.addEventListener("mouseleave", (e) => {
    clicking = false;
});