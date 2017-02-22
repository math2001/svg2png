"use strict";

const get = (selector, all=false) =>
    all ? document.querySelectorAll(selector) : document.querySelector(selector)

function to_elements(string) {
    // http://stackoverflow.com/a/494348/6164984
    const div = document.createElement('div')
    div.innerHTML = string
    return [div.childNodes, div]
}

const canvas = document.createElement('canvas')
const context = canvas.getContext('2d')
const file_input = get('#file')
const resultImage = get('#result-image')
const download = get('#download')
const text_input = get('#text-input')

const update_images = () => {
    const data = canvas.toDataURL()
    resultImage.setAttribute('src', data)
    download.download = 'image.png'
    download.href = data
}

const calls = (pro) => {
    const image = new Image()
    image.onload = function () {
        canvas.setAttribute('width', image.width + 'px')
        canvas.setAttribute('height', image.height + 'px')

        context.drawImage(image, 0, 0)
        update_images()
    }
    if (typeof pro == 'string') {
        image.src = pro
    } else {
        image.src = pro.target.result
    }
}

function handleUpload(e) {
    if (!e.target.files[0]) return

    if (e.target.files[0].type != 'image/svg+xml') {
        if (!confirm("Unvalid type of file, it should be 'image/svg+xml', got '" +
                     e.target.files[0].type) + "'. Click cancel to abort, or OK to keep going"
                     + "(might fail)") {
            return
        }
    }

    const fr = new FileReader()
    fr.onloadend = calls
    fr.readAsDataURL(e.target.files[0])
}

function handleInput(e) {
    // make the SVG a valid one
    // * add the xmlns link
    if (this.value == '') {
        return
    }
    var [els, div] = to_elements(this.value)
    var found = false
    for (var i = 0; i < els.length; i++) {
        if (els[i].nodeName != 'svg') {
            continue
        }
        if (els[i].getAttribute('xmlns') == null) {
            els[i].setAttribute('xmlns', "http://www.w3.org/2000/svg")
        }
        found = true
        break
    }
    if (!found) {
        alert("Didn't find any SVG tag in there.")
    }

    calls('data:image/svg+xml;base64,' + btoa(div.innerHTML))
}

file_input.addEventListener('change', handleUpload)
text_input.addEventListener('input', handleInput)
