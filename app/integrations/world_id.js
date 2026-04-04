const { signRequest } = require('@worldcoin/idkit-core/signing');

async function getWorldIdResult(key, action)  {

    return signRequest({signingKeyHex: key, action})

}

module.exports = { getWorldIdResult }