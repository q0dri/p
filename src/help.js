const { formatCurrency } = require("@coingecko/cryptoformat");
const fetch = require('node-fetch')
var moment = require('moment'); // 
require('moment-duration-format')

const help = function(prefix) { 
	return `                 
┏━━°❀ ❬ *TENTANG BOT* ❭ ❀°━━┓
┃
┣➥ *${prefix}info*
┣➥ *${prefix}donasi*
┣➥ *${prefix}owner*
┣➥ *${prefix}report [lapor bug]*
┃
┣━━━━°❀ ❬ *MEDIA* ❭ ❀°━━━━━⊱
┃
┣➥ *${prefix}image*
┣➥ *${prefix}meme*
┣➥ *${prefix}anime*
┃
┣━━━━━°❀ ❬ *CRYPTOCURRENCY* ❭ ❀°━━━━━⊱
┃
┣➥ *${prefix}p [coin]*
┣➥ *${prefix}calc [amount coin]*
┣➥ *${prefix}market [coin]*
┃
┣━━━━━°❀ ❬ *GRUP* ❭ ❀°━━━━━⊱
┃
┣➥ *${prefix}add*
┣➥ *${prefix}kick*
┣➥ *${prefix}grup [buka/tutup]*
┣➥ *${prefix}infogc*
┣➥ *${prefix}grupinfo*
┣➥ *${prefix}linkgrup*
┣➥ *${prefix}listadmins*
┃
┣━━━━━━━━━━━━━━━━━━━━
┃ *${new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')}*
┗━━━━━━━━━━━━━━━━━━━━`
}

const calc = function (amount, coin, idr, usd){
    return `*_${amount}  ${coin} =_*\nIDR ➻  ${formatCurrency(idr, 'IDR', 'id')}\nUSD = ${formatCurrency(usd, 'USD','en')}`;
}

const price = function(id,ml){
    //console.log(ml.market_data)
    const pr = ml.current_price
    const idr = formatCurrency(pr.idr, 'IDR', 'id');
    const usd = formatCurrency(pr.usd, 'USD', 'en');
    return `
┏━━°❀ ❬ *Price ${id}* ❭ ❀°━━┓
┃  IDR  ➻ ${idr}
┃  USD ➻ ${usd} 
┗━━━━━━━━━━━━━━━━━━━━━━━`

}

const market = function(id, market){
    const ml = market.tickers;
    const arr = []
    for(let i in ml){
        arr.push({ name: ml[i].market.name, price: ml[i].converted_last})
    }
    
    var h = [... new Map(arr.map(item => [item['name'], item])).values()].slice(0,10);
    var fin = []
    h.forEach(i => {
        fin.push(`${i.name} ➻  ${formatCurrency(i.price.usd, "USD", "en")}`);
    })
    return `
┏━━°❀ ❬ *Market ${id.toUpperCase()}* ❭ ❀°━━┓
┃  ${fin.join('=>').replace(/=>/g,"\n┃  ")}
┗━━━━━━━━━━━━━━━━━━━━━━━`
}

const gas = async () => {
    const data = await fetch('https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=DNCWUIR9GBCS7DIERYIIWPZ9Z2117IJ9ZZ').then(res => res.json())
    const {LastBlock,SafeGasPrice, ProposeGasPrice, FastGasPrice} = data.result
    const b = [SafeGasPrice,ProposeGasPrice,FastGasPrice]
    const r = []
    for(let i in b){
        const da = await fetch(`https://api.etherscan.io/api?module=gastracker&action=gasestimate&gasprice=${b[i]*1000000000}&apikey=DNCWUIR9GBCS7DIERYIIWPZ9Z2117IJ9ZZ`).then(res => res.json());
        let t;
        if(da.result<100){
            t = 'seconds'
        }else{
            t = 'minute'
        }
        r.push(`gwei : ${b[i]} time : ${moment.duration(da.result,"seconds").format("mm:ss")} ${t}`)
    }
    return `
┏━━°❀ ❬ *Gas Tricker* ❭ ❀°━━┓
┃  ${r.join('=>').replace(/=>/g,"\n┃  ")}
┗━━━━━━━━━━━━━━━━━━━━━━━`
}




module.exports = {
    help,
    calc,
    price,
    market,
    gas
}
