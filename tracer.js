import {diag, DiagConsoleLogger, DiagLogLevel} from "@opentelemetry/api";
import splunk from '@splunk/otel';

console.log('Enabling tracing via OpenTelemetry');


// If OTEL_LOG_LEVEL env var is set, configure logger
if (process.env.OTEL_LOG_LEVEL) {
    diag.setLogger(new DiagConsoleLogger(), DiagLogLevel[process.env.OTEL_LOG_LEVEL]);
}



const isConfigVarEntry = ([key, value]) => {
    const lowercased = key.toLowerCase();
    return lowercased.includes('splunk') || lowercased.includes('otel');
};

const redactSecretEntry = ([key, value]) => {
    if (key.toLowerCase().includes('access_token')) {
        return [key, '<redacted>'];
    }
    return [key, value];
};

const realmRegexp = /ingest\.(?<realm>[a-z0-9]*)\./;
const parseRealmFromEndpoint = (endpoint) => {
    if (!endpoint || typeof endpoint !== 'string') {
        return undefined;
    }
    return endpoint.match(re)?.groups?.realm;
};

// has a sideeffect of populating the basic opentelemetry config environment variables
export const populateEnv = () => {
    if (!process.env.OTEL_EXPORTER_OTLP_ENDPOINT && !process.env.SPLUNK_REALM) {
        process.env.SPLUNK_REALM = parseRealmFromEndpoint(
            process.env.OTEL_EXPORTER_JAEGER_ENDPOINT ?? ''
        );
    }
};
export const logConfig = () => {
    console.log(
        fromEntries(
            Object.entries(process.env)
                .filter(isConfigVarEntry)
                .map(redactSecretEntry)
        )
    );
};
const fromEntries = (iterable) => {
    return [...iterable].reduce((obj, [key, val]) => {
        obj[key] = val;
        return obj;
    }, {});
};
const log = (...args) => {
    return console.log(new Date(), ...args);
};
logConfig()
populateEnv()

splunk.start();