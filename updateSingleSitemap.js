const { createReadStream, createWriteStream, copyFile, unlink } = require('fs');
const { resolve } = require('path');
const { Transform } = require('stream');
const { SitemapStream, XMLToSitemapItemStream } = require('sitemap');
const { tmpdir } = require('os');

const dbUpdates = {
    'https://test.com/apps/app-2578290': {
        url:
            'https://test.com/apps/app-2578290',
        img: [
            {
                url: `https://test.com/app-logo-update.jpg`
            },
        ],
    },
};

const smStream = new SitemapStream();
const smPath = resolve('./sitemap-51.xml');
const tmpPath = resolve(tmpdir(), './sitemap-51.xml');

const updateEntries = new Transform({
    objectMode: true,
    transform(chunk, encoding, callback) {
        if (
            chunk.url ===
            'https://test.com/apps/app-2578290'
        ) {
            callback(undefined, { ...chunk, changefreq: 'daily' });
        } else if (chunk.url in dbUpdates) {
            callback(undefined, dbUpdates[chunk.url]);
        } else {
            callback(undefined, chunk);
        }
    },
});

const pipeline = createReadStream(smPath)
    .pipe(new XMLToSitemapItemStream())
    .pipe(updateEntries)
    .pipe(smStream) // turns options back into xml
    .pipe(createWriteStream(tmpPath));
pipeline.on('finish', () =>
    copyFile(tmpPath, smPath, (error) => {
        unlink(tmpPath, () => {});
    })
);
pipeline.on('error', (e) => e.code === 'EPIPE' || console.error(e));
