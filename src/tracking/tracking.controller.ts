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
        this.sendMessage(`Current Price Update ${this.basePrice}`);
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
        await page.goto('https://birdeye.so/token/AFbX8oGjGpmVFywbVouvhQSRmiW2aR1mohfahi4Y2AdB?fbclid=IwAR2Msk6ziTeYbP2_wBU4GKIQPDI2pDwCIpNjC9e8xob1gxPvqhwgac9wWeA');
        await page.waitForSelector(
            '#root > div > div.sc-faUpoM.yVtcP > div > div.sc-hmjpVf.kXoFgj > div.sc-eLwHnm.kzSJKe.side.left > div.ant-card.sc-gKclnd.sc-iCfMLu.gbwZcc.eehqFj.xs-none > div > div:nth-child(1) > div > div.sc-fHeRUh.hZCThT > div:nth-child(2) > span',
        );
        const price = await page.$eval(
            `#root > div > div.sc-faUpoM.yVtcP > div > div.sc-hmjpVf.kXoFgj > div.sc-eLwHnm.kzSJKe.side.left > div.ant-card.sc-gKclnd.sc-iCfMLu.gbwZcc.eehqFj.xs-none > div > div:nth-child(1) > div > div.sc-fHeRUh.hZCThT > div:nth-child(2) > span`,
            (el) => (el as HTMLSpanElement).innerText,
        );
        if (price) {
            try {
                console.log(Number(price.split('$')[1]));
                if (Number(price.split('$')[1]) >= this.basePrice) {
                    this.sendMessage(`Current Price $${Number(price.split(' ')[1])}`);
                }
            } catch (error) {}
        }

        await browser.close();
    }
}
