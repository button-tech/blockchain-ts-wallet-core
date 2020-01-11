function createSimpleMessage(comment = '') {
    var _0x648957 = new tonCell();
    _0x648957[_0x2756('0x2a')][_0x2756('0x1f')](string_to_ui8(comment));
    return _0x648957;
}

async function sign(privateKey, toAddress, amount, workchainId="-1", url) {
    privateKey = hexToBuffer(privateKey);
    const keyPair = nacl.sign.keyPair.fromSeed(privateKey);
    const fromAddress = await wallet_creation_generate_external_message(keyPair, workchainId);
    const hex_addr = fromAddress[0];

    const sender_account = await parseAddress(workchainId + ":" + hex_addr, url);
    const toAccountInfo = await parseAddress(toAddress, url);
    const toAccount = [Math.abs(toAccountInfo.workchainId), toAccountInfo.fullAddress, toAccountInfo.bounce];

    const seqno = await getSeqno(sender_account.workchainId + ':' + hex_addr, url);

    message = createSimpleMessage(comment);

    return await wallet_send_generate_external_message(
        keyPair,
        toAccount,
        amount,
        seqno,
        message,
        sender_account.workchainId
    );
}

async function parseAddress(address, url) {
    const res = await fetch(`${url}/getAccount/${address}`);
    return await res.json();
}

async function getSeqno(address, url) {
    const res = await fetch(`${url}/seqno/${address}`);
    const data = await res.json();
    console.log(data.seqno);
    return parseInt("0x" + data.seqno);
}
