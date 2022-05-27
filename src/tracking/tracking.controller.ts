import { Controller, Get, Param, Post } from '@nestjs/common';
import { config } from '../core';
import * as puppeteer from 'puppeteer';
import axios from 'axios';

@Controller('tracking')
export class TrackingController {
    private basePrice: number;
    private readonly TELEGRAM_URL = 'https://api.telegram.org/bot';

    constructor() {
        this.basePrice = Number(config.BASE_PRICE);
    }
    sendMessage = async (message: any) => {
        const url = `${this.TELEGRAM_URL}${config.TELEGRAM_BOT_TOKEN}/sendMessage?chat_id=${config.TELEGRAM_CHAT_ID}&text=${message}`;

        return await axios.get(url).catch(({ response }) => {
            console.log(response);
        });
    };

    @Get('/view')
    async test() {
        return `Current Price $${this.basePrice}`;
    }

    @Get('/update/:price')
    async cSendVerifyEmail(@Param('price') price: number) {
        try {
            this.basePrice = Number(price);
        } catch (error) {
            return 'wrong value';
        }

        return `Current Price $${this.basePrice}`;
    }

    @Post('/do-job')
    async crawlData() {
        const browser = await puppeteer.launch({
            // the amount of delay time for each action by bot
            slowMo: 200,
            // False: show the browser, True: not show the browser
            headless: true,
            args: ['--disable-gpu', '--disable-dev-shm-usage', '--disable-setuid-sandbox', '--no-sandbox'],
        });

        console.log('run cron job');
        const page = await browser.newPage();
        await page.goto('https://www.binance.com/en/price/gst');

        const price = await page.$eval(`#__APP > div > main > section > div > div.css-871wnf > div.css-1wh66rn > div.css-1267ixm > div.css-12ujz79`, (el) => (el as HTMLSpanElement).innerText);
        if (price) {
            try {
                if (Number(price.split(' ')[1]) >= this.basePrice) {
                    this.sendMessage(`Current Price $${Number(price.split(' ')[1])}`);
                }
            } catch (error) {}
        }
        await browser.close();
    }
}
