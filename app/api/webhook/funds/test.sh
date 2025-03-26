#!/bin/bash
curl -X POST \
  http://localhost:3005/api/webhook/funds \
  -H "Content-Type: application/json" \
  -H "X-Webhook-Secret: divizend" \
  -d '{
    "userId": "6135e2ac01649a00259abf69",
    "amount": 1000
  }'
