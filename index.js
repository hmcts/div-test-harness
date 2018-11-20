const url = require('url');
const request = require('request-promise-native');
const logger = require('@hmcts/nodejs-logging').Logger.getLogger(__filename);

const createAosCase = async (params = { authToken: '', caseData: {}, baseUrl: '' }, proxy) => {
    const createCaseResponse = await _createCaseForUser(params, proxy);
    logger.log('** Case created **');
    logger.log(createCaseResponse);
    // await _updateCase(params, createCaseResponse.id, 'awaitingDocumentsFromAwaitingHWFDecision', proxy);
    // await _updateCase(params, createCaseResponse.id, 'issueFromAwaitingDocs', proxy);
    return _updateCase(params, createCaseResponse.id, 'testAwaitingAos', proxy);
};

const createDnCase = async (params, proxy) => {
    const createCaseResponse = await _createCaseForUser(params, proxy);
    return _updateCase(params, createCaseResponse.id, 'testAwaitingDecreeNisi', proxy);
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
}

const _updateCase = (params, caseId, eventId, proxy) => {
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
    createDnCase
};