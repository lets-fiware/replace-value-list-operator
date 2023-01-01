/*
 * replace-value-list
 * https://github.com/lets-fiware/replace-value-list-operator
 *
 * Copyright (c) 2019-2023 Kazuhito Suda
 * Licensed under the MIT license.
 */

(function () {

    "use strict";

    var parseInputEndpointData = function parseInputEndpointData(data) {
        if (typeof data === "string") {
            try {
                data = JSON.parse(data);
            } catch (e) {
                throw new MashupPlatform.wiring.EndpointTypeError();
            }
        }

        if (data != null && !Array.isArray(data)) {
            throw new MashupPlatform.wiring.EndpointTypeError();
        }

        return data;
    };

    var getReplace = function getReplace() {
        var array = {};
        var values = MashupPlatform.prefs.get("replace").trim().split(',');

        if (values.length % 2 == 0) {
            for (var i = 0; i < values.length / 2; i++) {
                array[values[i]] = values[i + 1];
            }
        } else {
            throw new MashupPlatform.wiring.EndpointValueError();
        }
        return array;
    }

    var pushEvent = function pushEvent(data) {
        if (MashupPlatform.operator.outputs.output.connected) {
            MashupPlatform.wiring.pushEvent("output", data);
        }
    }

    var replaceList = function replaceList(list) {
        var replace = getReplace();
        list = parseInputEndpointData(list);

        if (list != null) {
            var newList = list.map(function (value) {
                return replace[value] || value;
            });
            pushEvent(newList);
        } else {
            if (MashupPlatform.prefs.get("send_nulls")) {
                pushEvent(list);
            }
        }
    };

    /* TODO
     * this if is required for testing, but we have to search a cleaner way
     */
    if (window.MashupPlatform != null) {
        MashupPlatform.wiring.registerCallback("input", replaceList);
    }

    /* test-code */
    window.replaceList = replaceList;
    /* end-test-code */

})();
