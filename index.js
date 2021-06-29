require('dotenv').config();

const logger = require('node-file-logger');
const ccxt = require('ccxt');

const loadData = async (config, binanceClient) => {
    logger.Trace('Start loading data');
    const { asset, base } = config;
    const market = `${asset}/${base}`;
    const balances = await binanceClient.fetchBalance();
    const assetBalance = balances.free[asset];
    const baseBalance = balances.free[base];
    logger.Info(`Balance: ${asset}:${assetBalance}; ${base}${baseBalance}`);
    const priceTicker = await binanceClient.fetchTicker(market);
    const closePrice = priceTicker.close;
    logger.Info(`Best sell price of ${asset}: ${closePrice} in ${base}`);
    const totalBalance = closePrice * assetBalance + baseBalance;
    logger.Info(`Total Balance: ${totalBalance}`);
    logger.Trace('End loading data');
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
console.log('Program start');