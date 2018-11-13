const fs = require('fs');
const util = require('util');
const url = require('url');
const request = require('request-promise-native');
const logger = require('@hmcts/nodejs-logging').Logger.getLogger(__filename);

const createAosCase =  (params, proxy) => {
    params.eventId = 'testAosAwaiting';
    return _createCase(params, proxy);
};

const createDnCase =  (params, proxy) => {
    params.eventId = 'testAwaitingDecreeNisi';
    return _createCase(params, proxy);
};

function _createCase(params, proxy) {
    return _readFile(params.caseDataFilePath, 'utf8')
        .then(caseData => {
            const caseDataJson = JSON.parse(caseData);
            return _createCaseForUser(params, caseDataJson, proxy);
        })
        .then((createCaseResponse) => {
            logger.info(`Created case ${createCaseResponse.id}`);
            return _updateCase(params, createCaseResponse.id, params.eventId, proxy);
        })
        .catch(error => {
            logger.info(`Error creating case: ${util.inspect(error)}`);
        });
}

const _readFile = (fileName, type) => {
    return new Promise(((resolve, reject) => {
        fs.readFile(fileName, type, (error, content) => {
            error ? reject(error) : resolve(content);
        });
    }));
};

const _createCaseForUser = (params, caseData, proxy) => {
    const uri = `${params.baseUrl}/casemaintenance/version/1/submit`;
    const headers = {
        Authorization: `Bearer ${params.authToken}`,
        'Content-Type': 'application/json'
    };

    const options = {
        uri,
        headers,
        body: caseData,
        json: true
    };

    if (proxy) {
        Object.assign(options, _setupProxy(proxy));
    }
    return request.post(options);
};

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

const _setupProxy = proxy  => {
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