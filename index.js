const express = require('express');
const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/add-text', async (req, res) => {
    const name = req.body.name;
    const imagePath = path.join(__dirname, 'image.jpg'); // المسار إلى الصورة الأصلية
    const outputPath = path.join(__dirname, 'public', 'output.jpg'); // المسار إلى الصورة المحررة

    try {
        const image = await loadImage(imagePath);
        const canvas = createCanvas(image.width, image.height);
        const ctx = canvas.getContext('2d');

        // رسم الصورة على canvas
        ctx.drawImage(image, 0, 0);

        // إضافة النص إلى الصورة
        ctx.font = '50px Arial';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.fillText(name, canvas.width / 2, 1300);

        // حفظ الصورة المحررة
        const out = fs.createWriteStream(outputPath);
        const stream = canvas.createJPEGStream();
        stream.pipe(out);

        out.on('finish', () => {
            res.send(`<a href="/output.jpg" download>Download Image</a>`);
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error processing image');
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});