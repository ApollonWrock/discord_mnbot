
#!/bin/bash
curl --user $curluser --data-binary '{"jsonrpc": "1.0", "id":"curltest", "method": "listmasternodes", "params": [] }' -H 'content-type: text/plain;' $apollonchainprovider  | jq -c '.result' | jq -c '[ .[] | select(.addr | contains($1)) ]'