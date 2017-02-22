"use strict";

const get = (selector, all=false) =>
    all ? document.querySelectorAll(selector) : document.querySelector(selector)

const canvas = document.createElement('canvas')
const context = canvas.getContext('2d')
const file_input = get('#file')
const resultImage = get('#result-image')
const download = get('#download')
const text_input = get('#text-input')

const update_images = (pro) => {
    const image = new Image()
    image.onload = function () {
        if (image) {
            canvas.setAttribute('width', image.width + 'px')
            canvas.setAttribute('height', image.height + 'px')
        } else {

        }
        context.drawImage(image, 0, 0)
        const data = canvas.toDataURL()
        resultImage.setAttribute('src', data)
        download.download = 'image.png'
        download.href = data
    }
    if (typeof pro == 'string') {
        image.src = pro
    } else {
        image.src = pro.target.result
    }
}

function handleUpload(e) {
    var fr = new FileReader()
    fr.onloadend = update_images
    fr.readAsDataURL(e.target.files[0])
}

function handleInput(e) {
    update_images('data:image/svg+xml;base64,' + btoa(this.value))
}

file_input.addEventListener('change', handleUpload)
text_input.addEventListener('input', handleInput)
