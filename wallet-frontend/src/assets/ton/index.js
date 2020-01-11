const url = "http://127.0.0.1:3000";
// const url = "http://localhost:3000";


async function sendGrams() {
    const privateKey = getData('privateKey');
    const toAddress = getData('toAddress');
    const amount = getData('amount');
    const comment = getData('comment');

    const hexBoc = await send(privateKey, toAddress, amount, "-1", "send", comment);

    document.getElementById('boc').innerText = hexBoc;
}

function createDelegateMessage(op, walletPub){
    var cell = new tonCell();
    cell[_0x2756('0x2a')]['put_ui_arbitrary'](op, 0x20);
    cell[_0x2756('0x2a')]['put_array_ui8'](walletPub);
    return cell;
}

function createWithdrawMessage(op){
    var cell = new tonCell();
    cell[_0x2756('0x2a')]['put_ui_arbitrary'](op, 0x20);
    return cell;
}

function createSimpleMessage(comment = '') {
    var _0x648957 = new tonCell();
    _0x648957[_0x2756('0x2a')][_0x2756('0x1f')](string_to_ui8(comment));
    return _0x648957;
}

function stakeRequest(op, electTime, maxFactor, adnlAddr, signature){

    var signatureCell = new tonCell();
    signatureCell[_0x2756('0x2a')]['put_array_ui8'](signature);

    var cell = new tonCell();
    cell[_0x2756('0x2a')]['put_ui_arbitrary'](op, 0x20);
    cell[_0x2756('0x2a')]['put_ui_arbitrary'](electTime, 0x20);
    cell[_0x2756('0x2a')]['put_ui_arbitrary'](maxFactor, 0x20);
    cell[_0x2756('0x2a')]['put_array_ui8'](adnlAddr);
    cell[_0x2756('0x2b')]['push'](signatureCell);

    return cell;
}

async function send(privateKey, toAddress, amount, workchainId="-1", call="send", comment='') {
    // console.log('account.workchainId: ', account.workchainId);
    console.log('workchainId: ', workchainId);
    privateKey = hexToBuffer(privateKey);
    const keyPair = nacl.sign.keyPair.fromSeed(privateKey);
    const fromAddress = await wallet_creation_generate_external_message(keyPair, workchainId);
    // console.log(fromAddress, "Should be address");
    const hex_addr = fromAddress[0];

    const sender_account = await parseAddress(workchainId + ":" + hex_addr);

    const account = await parseAddress(toAddress);

    // console.log('sa: ', workchainId + ":" + hex_addr);
    // console.log('seqno: ', seqno);


    const addr = [Math.abs(account.workchainId), account.fullAddress, account.bounce];

    // console.log('addr: ', addr);

    const seqno = await getSeqno(sender_account.workchainId + ':' + hex_addr);
    //
    // console.log('to addr: ', account.fullAddress);
    // console.log('workchainId: ', workchainId);
    // console.log('sender_account.workchainId: ', sender_account.workchainId);

    message = "";

    if (call === "send") {
        message = createSimpleMessage(comment);
    } else if(call === "delegate"){
        message = createDelegateMessage(0x543c1024, keyPair.publicKey);
    } else if (call === "stakeRequest"){
        // for tests
        signatureU8 = Uint8Array.from(atob("5EmRDhuE/Zxx0ofqojek06qF0cW6CdKUQ7MrUS2B6tpv83L5TFA8/C9lxo6YOgGeAAw3hEbEpWUrQu8UztR+Bw=="), c => c.charCodeAt(0));
        message = stakeRequest(0x654c5074, 1570086, 2, hexToBuffer("D420AA95074ECD8B292FF04A5D6C7BDC9CF26C150C2BE40E49496EC8107FF1A3"), base64ToBuffer("5EmRDhuE/Zxx0ofqojek06qF0cW6CdKUQ7MrUS2B6tpv83L5TFA8/C9lxo6YOgGeAAw3hEbEpWUrQu8UztR+Bw=="));
    }  else if (call === "withdraw") {
        message = createWithdrawMessage(0x79637324);
    }
    console.log(account.workchainId);

    const boc = await wallet_send_generate_external_message(
        keyPair,
        addr,
        amount,
        seqno,
        message,
        account.workchainId
    );
    await sendboc(boc);
    return boc;
}

async function parseAddress(address) {
    const res = await fetch(`${url}/getAccount/${address}`);
    return await res.json();
}

async function sendboc(data) {
    console.log('executed');
    const body = {
        hexData: data
    };
    const res = await fetch(`${url}/sendBoc`, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, cors, *same-origin
        headers: {
            'Content-Type': 'application/json',
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify(body), // тип данных в body должен соответвовать значению заголовка "Content-Type"
    });
    return await res.json();
}

async function getSeqno(address) {
    const res = await fetch(`${url}/seqno/${address}`);
    const data = await res.json();
    console.log(data.seqno);
    return parseInt("0x" + data.seqno);
}

async function test() {
    const privateKey = '';
    const toAddress = '0:949e17a0a9d49593489eb07446e394c150644b99ac2efe77ad3d1396253e16de';
    const amount = '1';
    const comment = '';

    send(privateKey, toAddress, amount, comment);
}

function getData(id, params = ['value']) {
    let value = document.getElementById(id);
    for (let i = 0; i < params.length; i++)
        value = value[params[i]];
    return value;
}


function hexStringToByte(str) {
    if (!str) {
        return new Uint8Array();
    }

    var a = [];
    for (var i = 0, len = str.length; i < len; i+=2) {
        a.push(parseInt(str.substr(i,2),16));
    }

    return new Uint8Array(a);
}

const fromHexString = hexString =>
    new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));

function base64ToBuffer(base64) {
    var binstr = atob(base64);
    var buf = new Uint8Array(binstr.length);
    Array.prototype.forEach.call(binstr, function (ch, i) {
        buf[i] = ch.charCodeAt(0);
    });
    return buf;
}
