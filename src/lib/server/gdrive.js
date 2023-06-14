import { google } from 'googleapis';
import dotenv from 'dotenv';
import { json } from '@sveltejs/kit';

dotenv.config()

const gAuth = new google.auth.OAuth2(
    process.env.GOOGLE_DRIVE_CLIENT_ID,
    process.env.GOOGLE_DRIVE_CLIENT_SECRET,
    process.env.GOOGLE_DRIVE_REDIRECT_URI
);

const gDriveUrl = gAuth.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/drive.file']
});

export function getAuthUrl() {
    return gDriveUrl
}

export async function generateCredentials(authCode) {
    try {
        let { tokens } = await gAuth.getToken(authCode)
        return tokens
    } catch (e) {
        console.log(e)
    }
    return null
}

export async function loadPoems(request) {
    const folderName = "PokeBook"
    let files = []

    gAuth.setCredentials({ refresh_token: request.refreshToken })
    const drive = google.drive({ version: 'v3', auth: gAuth });

    try {
        const res = await drive.files.list({
            q: `name='${folderName}' and trashed=false and mimeType='application/vnd.google-apps.folder'`,
            fields: 'nextPageToken, files(id, name)',
        });
        const folders = res.data.files;
        if (folders.length) {
            const folderId = folders[0].id;
            const res = await drive.files.list({
                q: `trashed=false and '${folderId}' in parents`,
                fields: 'nextPageToken, files(id, name)',
            });
            files = res.data.files;
        }
        return files;
    } catch (e) {
        console.log(e)
        return {
            status: e.response.status,
            errorData: e.response.data,
        }
    }

}

export async function deletePoem(request) {

    gAuth.setCredentials({ refresh_token: request.refreshToken })
    const drive = google.drive({ version: 'v3', auth: gAuth });

    drive.files.delete({ fileId: request.poemId }, (err, res) => {
        if (err) {
            console.error(err);
            return ({
                code: 500,
                message: `${err}`
            })
        }
    });

    drive.files.delete({ fileId: request.noteId }, (err, res) => {
        if (err) {
            console.error(err);
        }
    });
    return ({
        code: 200,
        message: "Oke!"
    })
}

export async function loadPoem(request) {

    gAuth.setCredentials({ refresh_token: request.refreshToken })
    const drive = google.drive({ version: 'v3', auth: gAuth });

    const fileId = request.poemId

    const metadata = await drive.files.get({ fileId, fields: '*' });
    const fileStream = await drive.files.get({ fileId, alt: 'media' }, { responseType: 'stream' });

    const note = await loadNote(request.refreshToken, metadata.data.originalFilename);

    return new Promise((resolve, reject) => {
        let content = '';
        fileStream.data.on('data', (chunk) => {
            content += chunk;
        });
        fileStream.data.on('error', (err) => {
            reject(err);
        });
        fileStream.data.on('end', () => {
            resolve(
                {
                    poemName: metadata.data.originalFilename,
                    poemContents: content,
                    poemNote: {
                        note: note.note,
                        noteId: note.noteId
                    }
                }
            );
        });
    });
}

async function loadNote(refreshToken, originalFilename) {

    const folderMimeType = 'application/vnd.google-apps.folder';
    const folderName = "PokeBook"
    let folder

    gAuth.setCredentials({ refresh_token: refreshToken })
    const drive = google.drive({ version: 'v3', auth: gAuth });

    try {
        const response = await drive.files.list({
            q: `mimeType='${folderMimeType}' and name='${folderName}' and trashed=false`,
            fields: 'files(id)',
        });
        if (response.data.files.length > 0) {
            folder = response.data.files[0];
        }

        const res = await drive.files.list({
            q: `name='${originalFilename + "_notes"}' and '${folder.id}' in parents and trashed=false`,
            fields: 'nextPageToken, files(id, name)',
        });

        const fileStream = await drive.files.get({ fileId: res.data.files[0].id, alt: 'media' }, { responseType: 'stream' });
        return new Promise((resolve, reject) => {
            let content = '';
            fileStream.data.on('data', (chunk) => {
                content += chunk;
            });
            fileStream.data.on('error', (err) => {
                reject(err);
            });
            fileStream.data.on('end', () => {
                resolve(
                    {
                        note: content,
                        noteId: res.data.files[0].id
                    }
                );
            });
        });

    } catch (err) {
        console.error(err);
        return ({
            code: 500,
            message: `${err}`
        })
    }

}

export async function updatePoem(request) {

    gAuth.setCredentials({ refresh_token: request.refreshToken })
    const drive = google.drive({ version: 'v3', auth: gAuth });

    // Update the name of the file
    await drive.files.update({
        fileId: request.poemId,
        resource: {
            name: request.poemName
        }
    });

    // Update the contents of the file
    await drive.files.update({
        fileId: request.poemId,
        media: {
            mimeType: 'text/plain',
            body: request.poemBody
        }
    });

    // Update the name of the poem note file
    await drive.files.update({
        fileId: request.noteId,
        resource: {
            name: request.poemName + "_notes"
        }
    });

    // Update the contents of the note
    await drive.files.update({
        fileId: request.noteId,
        media: {
            mimeType: 'text/plain',
            body: request.note
        }
    });

    return ({
        code: 200,
        message: "Oke!"
    })
}

export async function storePoem(request) {
    const folderMimeType = 'application/vnd.google-apps.folder';
    const folderName = "PokeBook"
    let folder

    gAuth.setCredentials({ refresh_token: request.refreshToken })
    const drive = google.drive({ version: 'v3', auth: gAuth });

    try {
        const response = await drive.files.list({
            q: `mimeType='${folderMimeType}' and name='${folderName}' and trashed=false`,
            fields: 'files(id)',
        });
        if (response.data.files.length > 0) {
            folder = response.data.files[0];
        } else {
            const fileMetadata = {
                name: folderName,
                mimeType: folderMimeType,
            };
            const response = await drive.files.create({
                resource: fileMetadata,
                fields: 'id',
            });
            folder = response.data;
        }
        const res = await drive.files.list({
            q: `name='${request.poemName + "_" + request.timestamp}' and '${folder.id}' in parents and trashed=false`,
            fields: 'nextPageToken, files(id, name)',
        });
        let fileId;
        const files = res.data.files;
        if (files.length) {
            // If the file exists, update it
            fileId = files[0].id;
            await drive.files.update({
                fileId,
                media: { body: request.poemBody },
            });
        } else {
            // If the file doesn't exist, create it
            const poemFileMetadata = {
                name: request.poemName + "_" + request.timestamp,
                mimeType: 'text/plain',
                parents: [folder.id],
            };
            const poemMedia = {
                mimeType: 'text/plain',
                body: request.poemBody,
            };
            await drive.files.create({
                resource: poemFileMetadata,
                media: poemMedia,
                fields: 'id',
            });
            const noteFileMetadata = {
                name: request.poemName + "_" + request.timestamp + "_notes",
                mimeType: 'text/plain',
                parents: [folder.id],
            };
            const noteMedia = {
                mimeType: 'text/plain',
                body: request.poemNote,
            };
            await drive.files.create({
                resource: noteFileMetadata,
                media: noteMedia,
                fields: 'id',
            });
        }
        return ({
            code: 200,
            message: "Oke!"
        })
    } catch (err) {
        console.error(err);
        return ({
            code: 500,
            message: `${err}`
        })
    }

}
