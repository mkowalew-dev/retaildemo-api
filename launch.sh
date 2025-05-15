#!/bin/bash
export OTEL_RESOURCE_ATTRIBUTES=deployment.environment=staging,service.version=1.1

#node -r @splunk/otel/instrument sales-auth-logistics-customer-inventory-app.js
node -r @splunk/otel/instrument app-psql.js