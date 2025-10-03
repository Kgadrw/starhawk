# Claims Page API Specification

## Overview
This document outlines all the API endpoints, data structures, and interactions needed for the Claims page in the Insurer Dashboard.

## 📊 Claims Page Endpoints Summary

### **Total Interactive Elements: 28**
- **Fixed Endpoints**: 11 (always visible)
- **Conditional Endpoints**: Up to 15 (5 per claim × 3 claims displayed)
- **Chart Interactions**: 2

---

## 🔗 API Endpoints Required

### 1. **Claims Management**

#### **GET /api/claims**
- **Purpose**: Fetch all claims with filtering and pagination
- **Query Parameters**:
  ```typescript
  {
    search?: string;           // Search by client name, claim ID, or damage type
    status?: 'all' | 'pending' | 'under_review' | 'approved' | 'rejected';
    priority?: 'all' | 'high' | 'medium' | 'low';
    page?: number;
    limit?: number;
  }
  ```
- **Response**:
  ```typescript
  {
    claims: Claim[];
    total: number;
    page: number;
    limit: number;
    filters: {
      statusCounts: { [status: string]: number };
      priorityCounts: { [priority: string]: number };
    };
  }
  ```

#### **GET /api/claims/:id**
- **Purpose**: Get detailed claim information
- **Response**: `Claim` object (see data structure below)

#### **PUT /api/claims/:id/status**
- **Purpose**: Update claim status
- **Body**:
  ```typescript
  {
    status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'pending_payment' | 'completed';
    notes?: string;
  }
  ```

#### **POST /api/claims/bulk-update**
- **Purpose**: Bulk update multiple claims
- **Body**:
  ```typescript
  {
    claimIds: string[];
    status: string;
    notes?: string;
  }
  ```

#### **GET /api/claims/export**
- **Purpose**: Export claims to CSV
- **Query Parameters**: Same as GET /api/claims
- **Response**: CSV file download

### 2. **Claims Analytics**

#### **GET /api/claims/analytics/status-distribution**
- **Purpose**: Get data for pie chart (Claims by Status)
- **Response**:
  ```typescript
  {
    data: [
      { name: 'Pending', value: number, color: string },
      { name: 'Under Review', value: number, color: string },
      { name: 'Approved', value: number, color: string }
    ];
  }
  ```

#### **GET /api/claims/analytics/trends**
- **Purpose**: Get data for bar chart (Claims Trend Analysis)
- **Query Parameters**:
  ```typescript
  {
    period: '6months' | '1year' | '2years';
  }
  ```
- **Response**:
  ```typescript
  {
    data: [
      {
        month: string;
        claims: number;
        approved: number;
        rejected: number;
      }
    ];
  }
  ```

### 3. **Document Management**

#### **GET /api/claims/:id/documents**
- **Purpose**: Get claim documents
- **Response**:
  ```typescript
  {
    documents: Document[];
  }
  ```

#### **GET /api/claims/:id/documents/:docId/download**
- **Purpose**: Download specific document
- **Response**: File download

#### **GET /api/claims/:id/documents/:docId/preview**
- **Purpose**: Get document preview/thumbnail
- **Response**: Image or preview data

---

## 📋 Data Structures

### **Claim Object**
```typescript
interface Claim {
  id: string;
  client: string;
  clientId: string;
  crop: string;
  type: string;                    // Damage type
  amount: number;
  status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'pending_payment' | 'completed';
  date: string;                    // ISO date string
  location: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  description: string;
  damageAssessment: {
    affectedArea: number;          // hectares
    yieldLoss: number;             // percentage
    estimatedLoss: number;
    photos: string[];              // URLs to damage photos
    droneImages: string[];         // URLs to drone images
    satelliteData: string;
  };
  policyDetails: {
    policyId: string;
    coverage: number;
    deductible: number;
    premium: number;
  };
  timeline: TimelineEvent[];
  documents: Document[];
  assessor: string;
  priority: 'high' | 'medium' | 'low';
}
```

### **Timeline Event**
```typescript
interface TimelineEvent {
  date: string;                    // ISO date string
  action: string;
  status: 'completed' | 'in_progress' | 'pending';
  userId?: string;
  notes?: string;
}
```

### **Document**
```typescript
interface Document {
  id: string;
  name: string;
  type: 'PDF' | 'ZIP' | 'CSV' | 'IMAGE';
  size: string;                    // Human readable size
  url: string;
  uploadedAt: string;              // ISO date string
  uploadedBy: string;
}
```

---

## 🎯 Frontend Interactions Mapping

### **Search & Filter Controls**
| Frontend Element | API Endpoint | Method |
|------------------|--------------|---------|
| Search Input | `/api/claims?search={term}` | GET |
| Status Filter | `/api/claims?status={status}` | GET |
| Priority Filter | `/api/claims?priority={priority}` | GET |
| Clear Filters | `/api/claims` | GET |
| Select All Checkbox | Client-side filtering | - |

### **Bulk Operations**
| Frontend Element | API Endpoint | Method |
|------------------|--------------|---------|
| Move to Review | `/api/claims/bulk-update` | POST |
| Approve All | `/api/claims/bulk-update` | POST |
| Clear Selection | Client-side | - |

### **Individual Claim Actions**
| Frontend Element | API Endpoint | Method |
|------------------|--------------|---------|
| Review Button | `/api/claims/{id}/status` | PUT |
| Approve Button | `/api/claims/{id}/status` | PUT |
| Reject Button | `/api/claims/{id}/status` | PUT |
| Process Payment | `/api/claims/{id}/status` | PUT |
| Mark Complete | `/api/claims/{id}/status` | PUT |

### **Navigation & Display**
| Frontend Element | API Endpoint | Method |
|------------------|--------------|---------|
| Previous/Next | Client-side pagination | - |
| Slide Indicators | Client-side | - |
| Claim Detail View | `/api/claims/{id}` | GET |

### **Charts & Analytics**
| Frontend Element | API Endpoint | Method |
|------------------|--------------|---------|
| Status Pie Chart | `/api/claims/analytics/status-distribution` | GET |
| Trend Bar Chart | `/api/claims/analytics/trends` | GET |

### **Export & Documents**
| Frontend Element | API Endpoint | Method |
|------------------|--------------|---------|
| Export CSV | `/api/claims/export` | GET |
| Document Download | `/api/claims/{id}/documents/{docId}/download` | GET |
| Document Preview | `/api/claims/{id}/documents/{docId}/preview` | GET |

---

## 🔄 Real-time Updates

### **WebSocket Events**
```typescript
// Claim status updates
{
  type: 'CLAIM_STATUS_UPDATED';
  data: {
    claimId: string;
    newStatus: string;
    updatedBy: string;
    timestamp: string;
  };
}

// New claim notifications
{
  type: 'NEW_CLAIM';
  data: Claim;
}

// Bulk operation completion
{
  type: 'BULK_UPDATE_COMPLETE';
  data: {
    claimIds: string[];
    status: string;
    successCount: number;
    errorCount: number;
  };
}
```

---

## 📊 Sample API Responses

### **GET /api/claims Response**
```json
{
  "claims": [
    {
      "id": "C001",
      "client": "John Doe",
      "clientId": "P001",
      "crop": "Maize",
      "type": "Drought Damage",
      "amount": 500000,
      "status": "pending",
      "date": "2024-03-12T00:00:00Z",
      "location": "Northern Province, Musanze District",
      "coordinates": {
        "lat": -1.9441,
        "lng": 29.8739
      },
      "description": "Severe drought conditions affecting 2.5 hectares of maize crop.",
      "damageAssessment": {
        "affectedArea": 2.5,
        "yieldLoss": 60,
        "estimatedLoss": 500000,
        "photos": ["/api/files/damage1.jpg", "/api/files/damage2.jpg"],
        "droneImages": ["/api/files/drone1.png"],
        "satelliteData": "Sentinel-2 imagery confirms drought stress indicators"
      },
      "policyDetails": {
        "policyId": "P001",
        "coverage": 2500000,
        "deductible": 100000,
        "premium": 250000
      },
      "timeline": [
        {
          "date": "2024-03-12T00:00:00Z",
          "action": "Claim submitted",
          "status": "completed"
        }
      ],
      "documents": [
        {
          "id": "DOC001",
          "name": "Claim Form",
          "type": "PDF",
          "size": "2.3 MB",
          "url": "/api/files/claim-form.pdf",
          "uploadedAt": "2024-03-12T10:30:00Z",
          "uploadedBy": "john.doe@email.com"
        }
      ],
      "assessor": "Alice Johnson",
      "priority": "high"
    }
  ],
  "total": 23,
  "page": 1,
  "limit": 10,
  "filters": {
    "statusCounts": {
      "pending": 8,
      "under_review": 3,
      "approved": 12
    },
    "priorityCounts": {
      "high": 5,
      "medium": 10,
      "low": 8
    }
  }
}
```

### **GET /api/claims/analytics/status-distribution Response**
```json
{
  "data": [
    {
      "name": "Pending",
      "value": 8,
      "color": "#F59E0B"
    },
    {
      "name": "Under Review", 
      "value": 3,
      "color": "#3B82F6"
    },
    {
      "name": "Approved",
      "value": 12,
      "color": "#10B981"
    }
  ]
}
```

---

## 🚀 Implementation Priority

### **Phase 1 (Core Functionality)**
1. `GET /api/claims` - Basic claims listing with filters
2. `GET /api/claims/:id` - Claim details
3. `PUT /api/claims/:id/status` - Status updates
4. `POST /api/claims/bulk-update` - Bulk operations

### **Phase 2 (Analytics)**
1. `GET /api/claims/analytics/status-distribution` - Pie chart data
2. `GET /api/claims/analytics/trends` - Bar chart data

### **Phase 3 (Advanced Features)**
1. `GET /api/claims/export` - CSV export
2. Document management endpoints
3. WebSocket real-time updates

---

## 🔐 Authentication & Authorization

All endpoints require:
- **Authentication**: JWT token in Authorization header
- **Authorization**: Role-based access control
  - `insurer:read` - View claims
  - `insurer:write` - Update claim status
  - `insurer:admin` - Bulk operations and exports

---

## 📝 Notes for Backend Developer

1. **Pagination**: Implement cursor-based pagination for better performance with large datasets
2. **Caching**: Cache analytics data for 5-10 minutes to improve performance
3. **File Storage**: Use cloud storage (AWS S3, etc.) for document and image files
4. **Rate Limiting**: Implement rate limiting for bulk operations
5. **Audit Logging**: Log all status changes and bulk operations
6. **Error Handling**: Return consistent error responses with proper HTTP status codes
7. **Validation**: Validate all input data and return meaningful error messages
8. **Database Indexing**: Index on status, priority, date, and client fields for fast filtering

This specification provides everything needed to implement the backend for the Claims page functionality.
