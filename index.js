const util = require('util');
const url = require('url');
const request = require('request-promise-native');
const logger = require('@hmcts/nodejs-logging').Logger.getLogger(__filename);

const createAosCase = (params, proxy) => {
    params.eventId = 'testAosAwaiting';
    return _createCase(params, proxy);
};

const createDnCase = (params, proxy) => {
    params.eventId = 'testAwaitingDecreeNisi';
    return _createCase(params, proxy);
};

const createDaCase = (params, proxy) => {
    params.eventId = 'testAwaitingDecreeAbsolute';
    return _createCase(params, proxy);
};

function _createCase(params, proxy) {
    return _createCaseForUser(params, proxy)
        .then(createCaseResponse => {
            logger.info(`Created case ${createCaseResponse.id}`);
            return updateCase(params, createCaseResponse.id, params.eventId, proxy);
        })
        .catch(error => {
            logger.info(`Error creating case: ${util.inspect(error)}`);
            throw error;
        });
}

const updateCase = (params, caseId, eventId, proxy) => {
    logger.info(`Issuing event ${eventId} against case ${caseId}.`);
    const baseUrl = params.baseUrl;
    const uri = `${baseUrl}/casemaintenance/version/1/updateCase/${caseId}/${eventId}`;
    const headers = {
        Authorization: `Bearer ${params.authToken}`,
        'Content-Type': 'application/json'
    };

    const options = {
        uri,
        headers,
        body: {},
        json: true
    };

    if (proxy) {
        Object.assign(options, _setupProxy(proxy));
    }
    return request.post(options);
};

function _createCaseForUser(params, proxy) {
    const uri = `${params.baseUrl}/casemaintenance/version/1/submit`;
    const headers = {
        Authorization: `Bearer ${params.authToken}`,
        'Content-Type': 'application/json'
    };

    const options = {
        uri,
        headers,
        body: params.caseData,
        json: true
    };

    if (proxy) {
        Object.assign(options, _setupProxy(proxy));
    }
    return request.post(options);
};

const _setupProxy = proxy => {
    const proxyUrl = url.parse(proxy);

    let proxyOptions = {};

    if (proxyUrl.protocol.indexOf('socks') >= 0) {
        proxyOptions = {
            strictSSL: false,
            agentClass: socksAgent,
            socksHost: proxyUrl.hostname || 'localhost',
            socksPort: proxyUrl.port || 9000
        };
    } else {
        proxyOptions = { proxy: proxyUrl.href };
    }

    return proxyOptions;
};


module.exports = {
    createAosCase,
    createDnCase,
    createDaCase,
    updateCase
};
