const axios = require('axios');

const BASE_URL = 'https://api.pay.walletconnect.com';
const TIMEOUT = 5000

async function paymentGet(id, apiKey) {

    if (!id || typeof id !== 'string') {
        throw new TypeError('id (string) is required');
    }
    if (!apiKey || typeof apiKey !== 'string') {
        throw new TypeError('apiKey (string) is required');
    }
    const url = `${BASE_URL}/v1/gateway/payment/${encodeURIComponent(id)}`;
    try {
        const res = await axios.get(url, {
            headers: {'Api-Key': apiKey},
            timeout: TIMEOUT,validateStatus: status => status >= 200 && status < 500});
        if (res.status !== 200) {
            const msg = res.data && res.data.message ? res.data.message : `Unexpected status ${res.status}`;
            const err = new Error(`Failed to fetch payment: ${msg}`);
            err.status = res.status;
            err.body = res.data;
            throw err;
        }
        const body = res.data;
        if (!body || typeof body !== 'object') {
            throw new Error('Invalid response: body is not an object');
        }
        const required = ['amount', 'merchant', 'status', 'expiresAt'];
        for (const key of required) {
            if (!(key in body)) {
                throw new Error(`Invalid response: missing required field "${key}"`);
            }
        }
        return body;
    } catch (err) {
        if (err.code === 'ECONNABORTED') {
            throw new Error(`Request timed out after ${timeoutMs}ms`);
        }
        if (err.response) {
            const e = new Error(`HTTP ${err.response.status}: ${JSON.stringify(err.response.data)}`);
            e.status = err.response.status;
            e.body = err.response.data;
            throw e;
        }
        throw err;
    }

}

async function paymentFetch(id, apiKey, body) {

    if (!id || typeof id !== 'string') {
        throw new TypeError('id (string) is required');
    }
    if (!apiKey || typeof apiKey !== 'string') {
        throw new TypeError('apiKey (string) is required');
    }
    if (!body || typeof body !== 'object') {
        throw new TypeError('body (object) is required');
    }
    const url = `${BASE_URL}/v1/gateway/payment/${encodeURIComponent(id)}/fetch`;
    try {
        const res = await axios.post(url, body, {
            headers: {'Api-Key': apiKey, 'Content-Type': 'application/json'},
            timeout: TIMEOUT,
            validateStatus: status => status >= 200 && status < 500});
        if (res.status !== 200) {
            const msg = res.data && res.data.message ? res.data.message : `Unexpected status ${res.status}`;
            const err = new Error(`Failed to fetch payment action: ${msg}`);
            err.status = res.status;
            err.body = res.data;
            throw err;
        }
        const data = res.data;
        if (!data || typeof data !== 'object') {
            throw new Error('Invalid response: body is not an object');
        }
        if (!Array.isArray(data.actions)) {
            throw new Error('Invalid response: missing or invalid "actions" array');
        }
        const firstAction = data.actions[0];
        if (!firstAction || typeof firstAction !== 'object' || !firstAction.type) {
            throw new Error('Invalid response: action objects malformed');
        }
        return data;
    } catch (err) {
        if (err.code === 'ECONNABORTED') {
            throw new Error(`Request timed out after ${timeoutMs}ms`);
        }
        if (err.response) {
            const e = new Error(`HTTP ${err.response.status}: ${JSON.stringify(err.response.data)}`);
            e.status = err.response.status;
            e.body = err.response.data;
            throw e;
        }
        throw err;
    }

}

async function paymentConfirm(id, apiKey, body) {

    if (!id || typeof id !== 'string') {
        throw new TypeError('id (string) is required');
    }
    if (!apiKey || typeof apiKey !== 'string') {
        throw new TypeError('apiKey (string) is required');
    }
    if (!body || typeof body !== 'object') {
        throw new TypeError('body (object) is required');
    }
    const url = `${BASE_URL}/v1/gateway/payment/${encodeURIComponent(id)}/confirm`;
    try {
        const res = await axios.post(url, body, {headers: {'Api-Key': apiKey,
            'Content-Type': 'application/json'},
            timeout: TIMEOUT,
            validateStatus: status => status >= 200 && status < 500
        });
        if (res.status !== 200) {
            const msg = res.data && res.data.message ? res.data.message : `Unexpected status ${res.status}`;
            const err = new Error(`Failed to confirm payment: ${msg}`);
            err.status = res.status;
            err.body = res.data;
            throw err;
        }
        const data = res.data;
        if (!data || typeof data !== 'object') {
            throw new Error('Invalid response: body is not an object');
        }
        const required = ['status', 'isFinal', 'info', 'pollInMs'];
        for (const key of required) {
            if (!(key in data)) {
                throw new Error(`Invalid response: missing required field "${key}"`);
            }
        }
        return data;
    } catch (err) {
        if (err.code === 'ECONNABORTED') {
            throw new Error(`Request timed out after ${timeoutMs}ms`);
        }
        if (err.response) {
            const e = new Error(`HTTP ${err.response.status}: ${JSON.stringify(err.response.data)}`);
            e.status = err.response.status;
            e.body = err.response.data;
            throw e;
        }
        throw err;
    }

}

module.exports = { paymentGet, paymentFetch, paymentConfirm };