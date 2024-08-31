const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

async function getPageContent(url, content_class_selector) {
    try {
        const response = await axios.get(url);
        const html = response.data;
        const load = cheerio.load(html);

        // Получаем содержимое div с id="main"
        // const mainContent = load('#post-content-body').html();
        const mainContent = load(content_class_selector).html();

        // получаем заголовок страницы
        const title = load('.tm-title_h1').text();                                          // FIXME Динамически определять
        const pageName = url.replaceAll('/', '-').replaceAll('.', '').slice(8, -1);

        // путь до папки вывода
        const dir = path.join(__dirname, 'res');
        const filePath = path.join(dir, `${pageName}.html`);


        const outputHtml =
            `<!DOCTYPE html>
                <html lang="ru">
                <head>
                    <link rel="stylesheet" href="./toaded.css">
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Содержимое title</title>
                </head>
                <body>
                    <div class="main-content-toad">
                        <h1 class="title-toad">
                            ${title}
                        </h1>
                        ${mainContent}
                    </div>
                </body>
            </html>`
        ;

        // запись в файл
        fs.writeFileSync(filePath, outputHtml);

    } catch (error) {
        console.error(`Error fetching the URL: ${error.message}`);
    }
}

const url = 'https://habr.com/ru/articles/839452/';
const content_class_selector = '#post-content-body'

getPageContent(url, content_class_selector);
