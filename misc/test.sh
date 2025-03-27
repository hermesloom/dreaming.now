#!/bin/bash
curl -X POST "http://localhost:3005/api/projects/divizend/funds" \
     -H "X-Webhook-Secret: 6c580f27-523e-4f23-b330-670470b61d66" \
     -H "Content-Type: application/json" \
     -d '{
       "userId": "6135e2ac01649a00259abf69",
       "amount": 100.5
     }'
