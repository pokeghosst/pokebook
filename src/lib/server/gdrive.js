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

export async function storePoem(refresh_token, poemName, poemBody) {
    const folderMimeType = 'application/vnd.google-apps.folder';
    const folderName = "PokeBook"
    let folder

    gAuth.setCredentials({ refresh_token })
    const drive = google.drive({ version: 'v3', auth: gAuth });

    try {
        const response = await drive.files.list({
            q: `mimeType='${folderMimeType}' and name='${folderName}' and trashed=false`,
            fields: 'files(id)',
        });
        if (response.data.files.length > 0) {
            folder = response.data.files[0];
            console.log(`Folder ${folderName} already exists with ID: ${folder.id}`);
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
            console.log(`Folder ${folderName} created with ID: ${folder.id}`);
        }
        const res = await drive.files.list({
            q: `name='${poemName}' and '${folder.id}' in parents and trashed=false`,
            fields: 'nextPageToken, files(id, name)',
        });
        console.log(poemName)
        console.log(poemBody)
        let fileId;
        const files = res.data.files;
        if (files.length) {
            // If the file exists, update it
            fileId = files[0].id;
            await drive.files.update({
                fileId,
                media: { body: poemBody },
            });
        } else {
            // If the file doesn't exist, create it
            const fileMetadata = {
                name: poemName,
                mimeType: 'text/plain',
                parents: [folder.id],
            };
            const media = {
                mimeType: 'text/plain',
                body: poemBody,
            };
            const res = await drive.files.create({
                resource: fileMetadata,
                media,
                fields: 'id',
            });
            fileId = res.data.id;
        }
        console.log(`File saved with ID: ${fileId}`);
    } catch (err) {
        console.error(`Error creating folder: ${err}`);
    }

}
