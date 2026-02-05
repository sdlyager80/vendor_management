# API Documentation

## Overview

This document describes the mock API endpoints for Assure Claims and ServiceNow FSO integrations.

All mock endpoints run on `http://localhost:3001` during development.

## Assure Claims API

Base URL: `http://localhost:3001/api/v1/assure`

### Get Claim Context

Retrieves complete claim context including parties, coverages, and reserves.

**Endpoint**: `GET /claims/:claimNumber/context`

**Response**:
```json
{
  "success": true,
  "data": {
    "claimNumber": "CLM-2024-001234",
    "claimStatus": "OPEN",
    "dateOfLoss": "2024-01-15",
    "claimType": "WORKERS_COMP",
    "claimant": {
      "partyId": "PTY-001",
      "partyType": "CLAIMANT",
      "firstName": "John",
      "lastName": "Doe",
      "dateOfBirth": "1985-06-20",
      "address": { ... },
      "phone": "2175551234",
      "email": "john.doe@email.com"
    },
    "handler": {
      "userId": "USR-001",
      "firstName": "Sarah",
      "lastName": "Johnson",
      "email": "sarah.johnson@tpa.com",
      "phone": "3125556789"
    },
    "injury": {
      "description": "Lower back strain from lifting",
      "bodyParts": ["Lower Back", "Lumbar Spine"],
      "treatmentStatus": "ONGOING"
    },
    "reserves": [
      {
        "reserveType": "MEDICAL",
        "amount": 50000,
        "paid": 12500,
        "outstanding": 37500,
        "lastUpdated": "2024-02-01"
      }
    ],
    "carrierId": "CAR-001",
    "carrierName": "Acme Insurance",
    "policyNumber": "POL-WC-2024-5678"
  },
  "metadata": {
    "timestamp": "2024-02-05T10:30:00Z",
    "requestId": "uuid"
  }
}
```

### Post Activity Journal Entry

Logs activity to the Assure Claims activity journal.

**Endpoint**: `POST /claims/:claimNumber/activity`

**Request Body**:
```json
{
  "activityType": "STATUS_CHANGE",
  "description": "Vendor referral created for IME",
  "userId": "USR-001"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "activityId": "ACT-123456",
    "claimNumber": "CLM-2024-001234",
    "activityType": "STATUS_CHANGE",
    "description": "Vendor referral created for IME",
    "timestamp": "2024-02-05T10:30:00Z"
  }
}
```

### Submit Payment Request

Triggers payment processing in Assure Claims A/P.

**Endpoint**: `POST /claims/:claimNumber/payments`

**Request Body**:
```json
{
  "payeeId": "VEN-001",
  "payeeName": "Medical Examination Services Inc",
  "payeeType": "VENDOR",
  "invoiceReference": "INV-2024-0001",
  "amount": 2500.00,
  "reserveType": "MEDICAL",
  "serviceDescription": "Independent Medical Examination",
  "serviceDate": "2024-01-25"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "paymentId": "PAY-1234567",
    "status": "PENDING",
    "expectedPaymentDate": "2024-02-12"
  }
}
```

### Get Payment Status

Retrieves current status of a payment request.

**Endpoint**: `GET /payments/:paymentId/status`

**Response**:
```json
{
  "success": true,
  "data": {
    "paymentId": "PAY-1234567",
    "status": "COMPLETED",
    "actualPaymentDate": "2024-02-10",
    "checkNumber": "CHK-98765"
  }
}
```

### Sync Document

Uploads document metadata to Assure Claims DocStore.

**Endpoint**: `POST /claims/:claimNumber/documents`

**Request Body**:
```json
{
  "documentType": "IME_REPORT",
  "fileName": "ime_report_20240125.pdf",
  "uploadedBy": "VEN-001"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "assureDocId": "DOC-789012",
    "claimNumber": "CLM-2024-001234",
    "documentType": "IME_REPORT",
    "fileName": "ime_report_20240125.pdf",
    "uploadedBy": "VEN-001",
    "uploadedDate": "2024-02-05T10:30:00Z"
  }
}
```

## ServiceNow FSO API

Base URL: `http://localhost:3001/api/v1/servicenow`

### Create Case

Creates a new case in ServiceNow FSO for referral tracking.

**Endpoint**: `POST /cases`

**Request Body**:
```json
{
  "referral": {
    "vendorId": "VEN-001",
    "claimNumber": "CLM-2024-001234",
    "serviceType": "IME",
    "instructions": "Request IME for lower back injury"
  },
  "claimContext": { ... }
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "caseId": "CASE-1707132600000",
    "caseNumber": "CSE-12345",
    "status": "ASSIGNED",
    "createdDate": "2024-02-05T10:30:00Z",
    "slaTarget": "2024-02-19T10:30:00Z"
  }
}
```

### Update Case Status

Updates case status and milestone tracking.

**Endpoint**: `PATCH /cases/:caseId`

**Request Body**:
```json
{
  "status": "IN_PROGRESS",
  "milestone": "EXAM_DONE",
  "notes": "Examination completed, report in progress"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "caseId": "CASE-1707132600000",
    "status": "IN_PROGRESS",
    "milestone": "EXAM_DONE",
    "updatedDate": "2024-02-05T10:30:00Z"
  }
}
```

### Get Case Details

Retrieves current case information.

**Endpoint**: `GET /cases/:caseId`

**Response**:
```json
{
  "success": true,
  "data": {
    "caseId": "CASE-1707132600000",
    "caseNumber": "CSE-12345",
    "status": "IN_PROGRESS",
    "assignedTo": "Vendor User",
    "createdDate": "2024-02-02T10:30:00Z",
    "lastUpdated": "2024-02-05T10:30:00Z"
  }
}
```

### Send Notification

Triggers notification delivery via email or SMS.

**Endpoint**: `POST /notifications`

**Request Body**:
```json
{
  "recipientId": "VEN-001",
  "notificationType": "REFERRAL_ASSIGNED",
  "message": "New referral assigned: CLM-2024-001234"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "notificationId": "uuid",
    "sentDate": "2024-02-05T10:30:00Z",
    "deliveryStatus": "SENT"
  }
}
```

## Error Responses

All endpoints return errors in a consistent format:

```json
{
  "success": false,
  "error": {
    "code": "CLAIM_NOT_FOUND",
    "message": "Claim CLM-2024-999999 not found"
  }
}
```

Common error codes:
- `CLAIM_NOT_FOUND` - Specified claim does not exist
- `VENDOR_NOT_FOUND` - Specified vendor does not exist
- `INVALID_REQUEST` - Request body validation failed
- `UNAUTHORIZED` - Authentication required
- `FORBIDDEN` - Insufficient permissions
- `INTERNAL_ERROR` - Server error

## Testing with cURL

### Get Claim Context
```bash
curl http://localhost:3001/api/v1/assure/claims/CLM-2024-001234/context
```

### Create Referral Case
```bash
curl -X POST http://localhost:3001/api/v1/servicenow/cases \
  -H "Content-Type: application/json" \
  -d '{
    "referral": {
      "vendorId": "VEN-001",
      "claimNumber": "CLM-2024-001234",
      "serviceType": "IME"
    }
  }'
```

### Submit Payment
```bash
curl -X POST http://localhost:3001/api/v1/assure/claims/CLM-2024-001234/payments \
  -H "Content-Type: application/json" \
  -d '{
    "payeeId": "VEN-001",
    "payeeName": "Test Vendor",
    "payeeType": "VENDOR",
    "invoiceReference": "INV-001",
    "amount": 2500.00,
    "reserveType": "MEDICAL",
    "serviceDescription": "IME",
    "serviceDate": "2024-01-25"
  }'
```
