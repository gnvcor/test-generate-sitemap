const { createReadStream, createWriteStream } = require('fs');
const { resolve } = require('path');
const { createGzip } = require('zlib');
const {
    SitemapAndIndexStream,
    SitemapStream,
    lineSeparatedURLsToSitemapOptions
} = require('sitemap');

const sms = new SitemapAndIndexStream({
    limit: 50000,
    lastmodDateOnly: false,
    getSitemapStream: (i) => {
        const sitemapStream = new SitemapStream({ hostname: 'https://test.com' });

        const path = `./sitemap-${i}.xml`;

        const ws = sitemapStream
            //.pipe(createGzip()) // for create *.xml.gz
            .pipe(createWriteStream(resolve(path)));

        return [new URL(path, 'https://test.com').toString(), sitemapStream, ws];
    },
});

lineSeparatedURLsToSitemapOptions(
    createReadStream('./data.txt')
)
    .pipe(sms)
    //.pipe(createGzip()) // for create *.xml.gz
    .pipe(createWriteStream(resolve('./sitemap-index.xml')));
    //.pipe(createWriteStream(resolve('./sitemap-index.xml.gz'))); // for create *.xml.gz
