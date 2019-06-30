import IconService from 'icon-sdk-js';


class Api {
    // ICONex Connect Extension =============================================================
    iconexAskAddress () {
        return this.__iconexConnectRequest('REQUEST_ADDRESS').then(payload => {
            return payload;
        })
    }
    // ======================================================================================

    // Following classes are private because they are lower level methods at a protocol level
    __sendTransaction (from, to, value, data) {
        const transaction = this.__icxTransactionBuild(from, to, value, 2000000, data);
        console.log(transaction);

        const jsonRpcQuery = {
            'jsonrpc': '2.0',
            'method': 'icx_sendTransaction',
            'params': IconService.IconConverter.toRawTransaction(transaction),
            'id': 1234
        };

        return this.__iconexJsonRpc(jsonRpcQuery)
    }

    __iconexConnectRequest (requestType, payload) {
        return new Promise((resolve, reject) => {
            function eventHandler (event) {
                const { payload } = event.detail;
                window.removeEventListener('ICONEX_RELAY_RESPONSE', eventHandler)
                resolve(payload)
            }
            window.addEventListener('ICONEX_RELAY_RESPONSE', eventHandler)

            window.dispatchEvent(new window.CustomEvent('ICONEX_RELAY_REQUEST', {
                detail: {
                    type: requestType,
                    payload
                }
            }))
        })
    }

    __iconexJsonRpc (jsonRpcQuery) {
        return this.__iconexConnectRequest('REQUEST_JSON-RPC', jsonRpcQuery).then(payload => {
            return payload
        })
    }

    __icxTransactionBuild (from, to, value, stepLimit, data) {
        return new IconService.IconBuilder.MessageTransactionBuilder()
            .from(from)
            .to(to)
            .value(IconService.IconAmount.of(value, IconService.IconAmount.Unit.ICX).toLoop())
            .stepLimit(IconService.IconConverter.toBigNumber(stepLimit))
            .nid(IconService.IconConverter.toBigNumber('0x3'))
            .version(IconService.IconConverter.toBigNumber('0x3'))
            .timestamp((new Date()).getTime() * 1000)
            .data(data)
            .build()
    }



}

export  default Api;