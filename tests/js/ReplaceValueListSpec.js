/*
 * replace-value-list
 * https://github.com/lets-fiware/replace-value-list-operator
 *
 * Copyright (c) 2019-2023 Kazuhito Suda
 * Licensed under the MIT license.
 */

/* globals MockMP */

(function () {

    "use strict";

    describe("ReplaceValueList", function () {

        beforeAll(function () {
            window.MashupPlatform = new MockMP({
                type: 'operator',
                prefs: {
                    "send_nulls": true,
                    "replace": "-9999,missing data"
                },
                inputs: ['input'],
                outputs: ['output']
            });
        });

        beforeEach(function () {
            MashupPlatform.reset();
            MashupPlatform.operator.outputs.output.connect({simulate: () => {}});
        });

        it("no replace", function () {
            replaceList([1, 2, 3]);

            expect(MashupPlatform.wiring.pushEvent).toHaveBeenCalledWith('output', [1, 2, 3]);
        });

        it("replace", function () {
            replaceList([-9999, 2, 3]);

            expect(MashupPlatform.wiring.pushEvent).toHaveBeenCalledWith('output', ["missing data", 2, 3]);
        });

        it("allowed to send nulls", function () {
            MashupPlatform.prefs.set("send_nulls", true);

            replaceList(null);

            expect(MashupPlatform.wiring.pushEvent).toHaveBeenCalledWith('output', null);
        });

        it("disallowed to send nulls", function () {
            MashupPlatform.prefs.set("send_nulls", false);

            replaceList(null);

            expect(MashupPlatform.wiring.pushEvent).not.toHaveBeenCalled();
        });

        it("throws an Endpoint Value error if illegal data is received", function () {
            expect(function () {
                replaceList("{");
            }).toThrowError(MashupPlatform.wiring.EndpointTypeError);
        });

        it("throws an Endpoint Value error if illegal data is received", function () {
            expect(function () {
                replaceList(123);
            }).toThrowError(MashupPlatform.wiring.EndpointTypeError);
        });

        it("throws an Endpoint Value error if replace parameter is error", function () {
            MashupPlatform.prefs.set("replace", "123,abc,xyz");

            expect(function () {
                replaceList(5);
            }).toThrowError(MashupPlatform.wiring.EndpointValueError);
        });

        it("output endoint is not connected", function () {
            MashupPlatform.reset();
            MashupPlatform.prefs.set("replace", "-9999,missing data");
            MashupPlatform.prefs.set("send_nulls", false);

            replaceList(null);

            expect(MashupPlatform.wiring.pushEvent).not.toHaveBeenCalled();
        });

    });
})();
