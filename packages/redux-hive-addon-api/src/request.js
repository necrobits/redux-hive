import * as queryString from "query-string";
import _ from "lodash";

const additionalHeaders = {
    'json': {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
    'form': {
        'Content-Type': 'application/x-www-form-urlencoded',
    },
}

const defaultResponseHandler = async (response) => {
    let responseBody = null;
    let ok = response.ok || false;
    const statusCode = response.status;
    responseBody = await response.text();
    try {
        responseBody = JSON.parse(responseBody);
    } catch (e) {
    }
    return ({
        body: responseBody,
        ok: ok,
        statusCode: statusCode,
    })
};

const defaultErrorHandler = () => ({
    body: null,
    ok: false,
    statusCode: 0,
});

function request(url, {
    query = {},
    body = null,
    method = 'GET',
    headers = {},
    type = 'json'
} = {}, {
    httpClient = fetch,
    responseHandler = defaultResponseHandler,
    errorHandler = defaultErrorHandler,
} = {}) {
    const {query: queryInUrl, url: pureUrl} = queryString.parseUrl(url);
    query = _.merge(query, queryInUrl);
    const targetUrl = queryString.stringifyUrl({
        url: pureUrl,
        query: query,
    });

    const typeHeaders = _.get(additionalHeaders, type, {});
    headers = _.merge(typeHeaders, headers);

    return httpClient(targetUrl, {
        method,
        body,
        headers,
    }).then(responseHandler).catch(errorHandler);
}

export default request;