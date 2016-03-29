////////////////////////////////////////////////////////////////////////////
//
// Copyright 2016 Realm Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
////////////////////////////////////////////////////////////////////////////

/* eslint-env es6, node */

'use strict';

if (typeof process == 'object' && ('' + process) == '[object process]') {
    class Worker {
        constructor(script) {
            this._process = require('child_process').fork(script);

            this._process.on('message', (message) => {
                if (this.onmessage) {
                    this.onmessage(message);
                }
            });
        }
        postMessage(message) {
            this._process.send(message);
        }
        terminate() {
            if (this._process) {
                this._process.kill();
                delete this._process;
            }
        }
    }

    module.exports = Worker;
} else {
    const {
        nativeStartWorker,
        nativePostMessageToWorker,
        nativeTerminateWorker,
    } = global;

    class Worker {
        constructor(script) {
            this.id = nativeStartWorker(script, this, {
                __fbBatchedBridgeConfig,  // eslint-disable-line no-undef
            });
        }
        postMessage(message) {
            if (this.id) {
                nativePostMessageToWorker(this.id, message);
            }
        }
        terminate() {
            if (this.id) {
                nativeTerminateWorker(this.id);
                delete this.id;
            }
        }
    }

    module.exports = Worker;
}
