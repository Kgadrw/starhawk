# Test Users for Dashboard Blueprint Nexus

## Overview
This file contains test user credentials for different roles in the system. Use these for development and testing purposes only.

---

## 👥 Test Users by Role

### **1. Insurer Role**

#### **Primary Insurer**
- **Email**: `insurer@nexus.com`
- **Password**: `Insurer123!`
- **Role**: `insurer`
- **Name**: Sarah Johnson
- **Department**: Claims Management
- **Permissions**: Full access to claims, policies, risk assessment, and analytics

#### **Insurer Manager**
- **Email**: `manager@nexus.com`
- **Password**: `Manager123!`
- **Role**: `insurer_manager`
- **Name**: Michael Chen
- **Department**: Operations
- **Permissions**: All insurer permissions + bulk operations + exports

#### **Insurer Analyst**
- **Email**: `analyst@nexus.com`
- **Password**: `Analyst123!`
- **Role**: `insurer_analyst`
- **Name**: Emily Rodriguez
- **Department**: Risk Assessment
- **Permissions**: Read-only access to claims, full access to risk assessment and analytics

---

### **2. Farmer Role**

#### **Primary Farmer**
- **Email**: `farmer@nexus.com`
- **Password**: `Farmer123!`
- **Role**: `farmer`
- **Name**: John Doe
- **Farm**: Green Valley Farm
- **Location**: Northern Province, Musanze District
- **Crops**: Maize, Beans
- **Farm Size**: 5.2 hectares

#### **Small Farm Owner**
- **Email**: `smallfarmer@nexus.com`
- **Password**: `Small123!`
- **Role**: `farmer`
- **Name**: Jane Smith
- **Farm**: Sunrise Fields
- **Location**: Eastern Province, Rwamagana District
- **Crops**: Rice, Vegetables
- **Farm Size**: 2.1 hectares

#### **Large Farm Owner**
- **Email**: `largefarmer@nexus.com`
- **Password**: `Large123!`
- **Role**: `farmer`
- **Name**: Peter Kimani
- **Farm**: Mountain View Agriculture
- **Location**: Western Province, Rubavu District
- **Crops**: Maize, Coffee, Beans
- **Farm Size**: 12.5 hectares

---

### **3. Assessor Role**

#### **Field Assessor**
- **Email**: `assessor@nexus.com`
- **Password**: `Assessor123!`
- **Role**: `assessor`
- **Name**: Alice Johnson
- **Specialization**: Crop Damage Assessment
- **Region**: Northern Province
- **Experience**: 8 years

#### **Senior Assessor**
- **Email**: `senior.assessor@nexus.com`
- **Password**: `Senior123!`
- **Role**: `senior_assessor`
- **Name**: Bob Wilson
- **Specialization**: Risk Assessment & Satellite Analysis
- **Region**: All Provinces
- **Experience**: 15 years

#### **Drone Specialist**
- **Email**: `drone@nexus.com`
- **Password**: `Drone123!`
- **Role**: `assessor`
- **Name**: Sarah Mwangi
- **Specialization**: Drone Imaging & Aerial Assessment
- **Region**: Eastern & Western Provinces
- **Experience**: 5 years

---

### **4. Government Role**

#### **Agricultural Officer**
- **Email**: `gov.officer@nexus.com`
- **Password**: `Gov123!`
- **Role**: `government`
- **Name**: David Nkurunziza
- **Department**: Ministry of Agriculture
- **Position**: Regional Agricultural Officer
- **Region**: Northern Province

#### **Policy Analyst**
- **Email**: `policy@nexus.com`
- **Password**: `Policy123!`
- **Role**: `government`
- **Name**: Grace Uwimana
- **Department**: Ministry of Agriculture
- **Position**: Policy Analyst
- **Region**: National

---

### **5. Admin Role**

#### **System Administrator**
- **Email**: `admin@nexus.com`
- **Password**: `Admin123!`
- **Role**: `admin`
- **Name**: System Administrator
- **Permissions**: Full system access, user management, system configuration

#### **Super Admin**
- **Email**: `superadmin@nexus.com`
- **Password**: `Super123!`
- **Role**: `super_admin`
- **Name**: Super Administrator
- **Permissions**: All admin permissions + database access + system logs

---

## 🔐 Authentication Details

### **Password Policy**
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- At least 1 special character (!@#$%^&*)

### **Session Management**
- **Session Timeout**: 8 hours
- **Refresh Token**: 7 days
- **Max Login Attempts**: 5
- **Lockout Duration**: 15 minutes

---

## 🎯 Role Permissions Matrix

| Feature | Farmer | Assessor | Government | Insurer | Admin |
|---------|--------|----------|------------|---------|-------|
| View Claims | Own Only | All | All | All | All |
| Create Claims | ✅ | ❌ | ❌ | ❌ | ✅ |
| Update Claims | Own Only | Assessment | ❌ | All | All |
| Delete Claims | ❌ | ❌ | ❌ | ❌ | ✅ |
| View Policies | Own Only | ❌ | All | All | All |
| Create Policies | ❌ | ❌ | ❌ | ✅ | ✅ |
| Risk Assessment | ❌ | ✅ | View Only | ✅ | ✅ |
| Analytics | ❌ | Basic | All | All | All |
| User Management | ❌ | ❌ | ❌ | ❌ | ✅ |
| System Config | ❌ | ❌ | ❌ | ❌ | ✅ |

---

## 🧪 Testing Scenarios

### **1. Claims Workflow Testing**
```
1. Login as farmer@nexus.com
2. Create a new claim
3. Login as assessor@nexus.com
4. Review and assess the claim
5. Login as insurer@nexus.com
6. Approve/reject the claim
7. Login as gov.officer@nexus.com
8. View claim status and analytics
```

### **2. Risk Assessment Testing**
```
1. Login as assessor@nexus.com
2. Access risk assessment tools
3. Upload drone images
4. Generate risk reports
5. Login as insurer@nexus.com
6. Review risk assessments
7. Make policy decisions
```

### **3. Analytics Testing**
```
1. Login as insurer@nexus.com
2. View claims analytics
3. Export reports
4. Login as gov.officer@nexus.com
5. View government analytics
6. Generate policy reports
```

### **4. Admin Testing**
```
1. Login as admin@nexus.com
2. Manage users
3. Configure system settings
4. View system logs
5. Test all role permissions
```

---

## 📱 API Testing

### **Authentication Endpoint**
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "insurer@nexus.com",
  "password": "Insurer123!"
}
```

### **Expected Response**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_123",
    "email": "insurer@nexus.com",
    "role": "insurer",
    "name": "Sarah Johnson",
    "permissions": ["claims:read", "claims:write", "policies:read", "analytics:read"]
  }
}
```

---

## ⚠️ Security Notes

1. **Development Only**: These credentials are for development and testing only
2. **Change Passwords**: Change all passwords before production deployment
3. **Environment Variables**: Store credentials in environment variables, not in code
4. **Database Seeding**: Use these users for database seeding scripts
5. **Test Data**: Each user has associated test data (claims, policies, etc.)

---

## 🗃️ Database Seeding

### **SQL Insert Example**
```sql
INSERT INTO users (id, email, password_hash, role, name, created_at) VALUES
('user_001', 'insurer@nexus.com', '$2b$10$...', 'insurer', 'Sarah Johnson', NOW()),
('user_002', 'farmer@nexus.com', '$2b$10$...', 'farmer', 'John Doe', NOW()),
('user_003', 'assessor@nexus.com', '$2b$10$...', 'assessor', 'Alice Johnson', NOW()),
('user_004', 'gov.officer@nexus.com', '$2b$10$...', 'government', 'David Nkurunziza', NOW()),
('user_005', 'admin@nexus.com', '$2b$10$...', 'admin', 'System Administrator', NOW());
```

### **Password Hashing**
Use bcrypt with salt rounds of 10 for password hashing:
```javascript
const bcrypt = require('bcrypt');
const hashedPassword = await bcrypt.hash('Insurer123!', 10);
```

---

## 📞 Contact Information

For questions about test users or role permissions:
- **Development Team**: dev@nexus.com
- **System Admin**: admin@nexus.com
- **Security Team**: security@nexus.com

---

**Last Updated**: 2024-03-15
**Version**: 1.0
**Environment**: Development/Testing
