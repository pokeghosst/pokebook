// TODO: REFACTOR TO LIB/SERVER

import { goto } from '$app/navigation';
// import * as htmlToImage from 'html-to-image';
import domtoimage from 'dom-to-image';
import { poemImage } from '../stores/exported';

export default function generateImage(poemName) {
    const textarea = document.getElementById("poem-textarea")
    const poemNotebook = document.getElementById('poem-notebook')
    const initWidth = textarea.style.width
    textarea.style.width = "794px"
    poemNotebook.style.width = "794px"
    const initHeight = textarea.style.height
    const newHeight = (textarea.scrollHeight + 32) + "px"
    textarea.style.height = newHeight
    poemNotebook.style.height = newHeight
    domtoimage
        .toPng(poemNotebook)
        .then(function (dataUrl) {
            textarea.style.height = initHeight
            poemNotebook.style.height = initHeight
            textarea.style.width = initWidth
            poemNotebook.style.width = initWidth
            var img = new Image();
            img.src = dataUrl;
            poemImage.set(img)
            goto("/export")
        })
        .catch(function (error) {
            console.error('oops, something went wrong!', error);
        });
}