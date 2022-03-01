const density = "$@B%8&WM#*oahkbdpqmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,\"^`'. ";
const lengthDensity = density.length;

const canvas = document.getElementById("canvas");
const input = document.getElementById("picture");
const ctx = canvas.getContext("2d");

input.onchange = (e) => {
    const file = e.target.files[0];

    const reader = new FileReader();
    reader.onload = (event) => {
        const image = new Image();
        image.onload = () => {
            const [width, height] = changeDimension(image.width, image.height);

            canvas.width = width;
            canvas.height = height;
            
            ctx.drawImage(image,0,0, width, height);

            drawAscii(convertGrayScale(ctx, width, height), width);
            
        }
        
        image.src = event.target.result;
    }

    reader.readAsDataURL(file);
}

const toGrayScale = (r,g,b) => 0.21 * r + 0.72 * g + 0.07 * b;

const convertGrayScale = (context, width, height) => {
    const imageData = context.getImageData(0,0,width,height);

    const grayScales = [];

    for (let i = 0; i < imageData.data.length; i += 4) {
        const r = imageData.data[i];
        const g = imageData.data[i+1];
        const b = imageData.data[i +2];

        const grayScale = toGrayScale(r,g,b);
        imageData.data[i] = imageData.data[i+1] = imageData.data[i+2] = grayScale;

        grayScales.push(grayScale);
    }

    context.putImageData(imageData, 0,0);

    return grayScales
}

const grayScaleCharacter = grayScale => density[Math.ceil((lengthDensity - 1) * grayScale / 255)];

const asciiImage = document.querySelector("pre#ascii");

const drawAscii = (grayScale, width) => {
    const ascii = grayScale.reduce((asciiImage, grayScale, index) => {
        let nexChars = grayScaleCharacter(grayScale);

        if ((index + 1) % width === 0) {
            nexChars += '\n';
        }
    
        return asciiImage + nexChars;
    }, "");

    asciiImage.textContent = ascii;
}


const MAXIMUM_HEIGHT = 100;
const MAXIMUM_WIDTH = 100;

const changeDimension = (widht, height) => {
    if (height > MAXIMUM_HEIGHT) {
        const reduceWidth = Math.floor(widht * MAXIMUM_HEIGHT / height);
        return [reduceWidth, MAXIMUM_HEIGHT]
    }

    if (widht > MAXIMUM_WIDTH) {
        const reduceHeight = Math.floor(height * MAXIMUM_WIDTH / widht);
        return [MAXIMUM_WIDTH, reduceHeight]
    }

    return [widht, height];
}