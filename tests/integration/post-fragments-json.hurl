# tests/integration/post-fragments-json.hurl

POST http://localhost:8080/v1/fragments

Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==

Content-Type: application/json
{
  "data": "This is a fragment!"
}

# 1. We expect to get back an HTTP 201
HTTP/1.1 201
# We have various assertions about the response that we want to check 
[Asserts]
# The Location header should look like what we expect (including the fragment id)
header "Location" matches "^http:\/\/localhost:8080\/v1\/fragments\/[A-Za-z0-9_-]+$"
jsonpath "$.status" == "ok"
jsonpath "$.fragment.id" matches "^[A-Za-z0-9_-]+$"
jsonpath "$.fragment.ownerId" matches "^[0-9a-fA-F]+$"
jsonpath "$.fragment.created" isString
jsonpath "$.fragment.updated" isString
jsonpath "$.fragment.type" == "application/json"
# Capture the Location URL into a variable named `url`
[Captures]
url: header "Location"

# GET request
GET {{url}}
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==

HTTP/1.1 200

# Check the content type
Content-Type: application/json; charset=utf-8
[Asserts]
{
  "data": "This is a fragment!"
}
