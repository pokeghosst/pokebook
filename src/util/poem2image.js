// TODO: REFACTOR TO LIB/SERVER

import { goto } from '$app/navigation';
// import * as htmlToImage from 'html-to-image';
import domtoimage from 'dom-to-image';
import { poemImage } from '../stores/exported';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Share } from '@capacitor/share'


export default function generateImage(poemName, poemText) {

    return Filesystem.writeFile({
        path: poemName,
        data: poemText,
        directory: Directory.Cache,
        recursive: true
    }).then(() => {
        return Filesystem.getUri({
            directory: Directory.Cache,
            path: poemName
        })
    }).then((uriResult => {
        return Share.share({
            title: poemName,
            text: poemText,
            url: uriResult.uri
        })
    }))

    // domtoimage
    //     .toPng(poemNotebook)
    //     .then(function (dataUrl) {
    //         textarea.style.height = initHeight
    //         poemNotebook.style.height = initHeight
    //         textarea.style.width = initWidth
    //         poemNotebook.style.width = initWidth
    //         var img = new Image();
    //         img.src = dataUrl;
    //         poemImage.set(img)
    //         goto("/export")
    //     })
    //     .catch(function (error) {
    //         console.error('oops, something went wrong!', error);
    //     });

}