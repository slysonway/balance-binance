require('dotenv').config();

const logger = require('node-file-logger');
const ccxt = require('ccxt');

const loadData = async (config, binanceClient) => {
    const { asset, base } = config;
    const market = `${asset}/${base}`;
    const balances = await binanceClient.fetchBalance();
    const assetBalance = balances.free[asset];
    const baseBalance = balances.free[base];
    logger.Info(`Balance: ${asset}:${assetBalance}; ${base}${baseBalance}`);
    const priceTicker = await binanceClient.fetchTicker(market);
    const price = priceTicker.bid * assetBalance + baseBalance;
    logger.Info(`Total price: ${price}`);
    

}

const run = () => {
    const config = {
        asset:'BTC',
        base: 'USDT',
        tickInterval: 5000
    };

    const binanceClient = new ccxt.binance({
        apiKey: process.env.API_KEY,
        secret: process.env.API_SECRET
    });
    binanceClient.setSandboxMode(true);

    loadData(config, binanceClient);
    setInterval(loadData, config.tickInterval, config, binanceClient);
};

run();