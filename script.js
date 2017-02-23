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

const generate = (svg_code) => {
    const base64 = 'data:image/svg+xml;base64,' + btoa(validate_svg(svg_code))
    const image = new Image()
    image.onload = function () {
        canvas.setAttribute('width', image.width + 'px')
        canvas.setAttribute('height', image.height + 'px')

        context.drawImage(image, 0, 0)
        update_images()
    }
    image.src = base64
}

function validate_svg(svg) {
    // the div is used to get the final xml (it gets updated as we update the children)
    var [els, div] = to_elements(svg);

    (function set_xmlns(els) {
        for (var i = 0; i < els.length; i++) {
            if (els[i].nodeName != 'svg') {
                continue
            }
            if (els[i].getAttribute('xmlns') == null) {
                els[i].setAttribute('xmlns', "http://www.w3.org/2000/svg")
            }
            return
        }
        alert("Didn't find any <svg> tag in there.")
    })(els)

    return div.innerHTML
}

function handleFile(file) {

    if (!file) return

    if (file.type != 'image/svg+xml') {
        if (!confirm("Unvalid type of file, it should be 'image/svg+xml', got '" +
                     file.type) + "'. Click cancel to abort, or OK to keep going"
                     + "(might fail)") {
            return
        }
    }

    const fr = new FileReader()
    fr.onloadend = (process) => generate(process.target.result)

    fr.readAsText(file)
}

function handleInput(e) {

    if (this.value == '') {
        return
    }

    generate(this.value)
}

function handleDrop(e) {
    e.preventDefault()
    e.stopPropagation()
    document.body.classList.remove('dragging-over')

    handleFile(e.dataTransfer.files[0])
}

function handleDrag(e) {
    e.preventDefault()
    e.stopPropagation()
    e.dataTransfer.dropEffect = 'copy'
    document.body.classList.add('dragging-over')
}

function handleDragEnd(e) {
    e.preventDefault()
    document.body.classList.remove('dragging-over')
}

file_input.addEventListener('change', handleFile)
text_input.addEventListener('input', handleInput)
document.body.addEventListener('drop', handleDrop)
document.body.addEventListener('dragover', handleDrag)
document.body.addEventListener('dragleave', handleDragEnd)
