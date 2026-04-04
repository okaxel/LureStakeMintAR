const { signRequest } = require('@worldcoin/idkit-core/signing');

export async function getWorldIdResult(key, action)  {

    return signRequest({signingKeyHex: key, action})

}