const fs = require('fs');

const data = fs.createWriteStream('data.txt');

for (let i = 0; i <= 5000000; i++) {
    const jsonData = JSON.stringify({
        url: `https://test.com/apps/app-${i}`,
        img: [
            {
                url: `https://test.com/app-logo-${i}.jpg`
            }
        ]
    })
    
    data.write(`${i === 0 ? '' : '\n'}${jsonData}`);
}

data.end();
