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

function request(url, {
    query = {},
    body = null,
    method = 'GET',
    headers = {},
    type = 'json'
} = {}) {
    const {query: queryInUrl, url: pureUrl} = queryString.parseUrl(url);
    query = _.merge(query, queryInUrl);
    const targetUrl = queryString.stringifyUrl({
        url: pureUrl,
        query: query,
    });

    const typeHeaders = _.get(additionalHeaders, type, {});
    headers = _.merge(typeHeaders, headers);

    return fetch(targetUrl, {
        method,
        body,
        headers,
    }).then(async (response) => {
        let responseBody;
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
    }).catch(() => ({
        body: null,
        ok: false,
        statusCode: 0,
    }));
}

export default request;
