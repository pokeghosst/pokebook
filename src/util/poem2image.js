import * as htmlToImage from 'html-to-image';
import download from 'downloadjs'

export default function generateImage(poemName) {
    const textarea = document.getElementById("poem-textarea")
    const poemNotebook = document.getElementById('poem-notebook')
    const initHeight = textarea.style.height
    const newHeight = (textarea.scrollHeight + 32) + "px"
    textarea.style.height = newHeight
    poemNotebook.style.height = newHeight
    htmlToImage
        .toJpeg(poemNotebook)
        .then(function (dataUrl) {
            download(dataUrl, poemName + '.jpeg')
            textarea.style.height = initHeight
            poemNotebook.style.height = initHeight
        })
        .catch(function (error) {
            console.error('oops, something went wrong!', error);
        });
}