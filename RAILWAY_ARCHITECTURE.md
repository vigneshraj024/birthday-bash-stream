# Railway Deployment Architecture

## 🏗️ Architecture Overview

```mermaid
graph TB
    subgraph "User's Browser"
        A[React Frontend<br/>Vite App]
    end
    
    subgraph "Railway - Frontend Service"
        B[Frontend Server<br/>Port: Auto-assigned<br/>Command: npm run preview]
    end
    
    subgraph "Railway - Backend Service"
        C[Express Server<br/>Port: 3001<br/>Pixverse Proxy]
    end
    
    subgraph "External Services"
        D[Pixverse AI API<br/>Video Generation]
        E[Supabase<br/>Database]
    end
    
    A -->|HTTPS| B
    B -->|API Calls<br/>VITE_BACKEND_URL| C
    C -->|Proxy Requests<br/>PIXVERSE_API_KEY| D
    B -->|Database Queries<br/>VITE_SUPABASE_URL| E
    
    style B fill:#7c3aed,stroke:#5b21b6,color:#fff
    style C fill:#7c3aed,stroke:#5b21b6,color:#fff
    style D fill:#10b981,stroke:#059669,color:#fff
    style E fill:#10b981,stroke:#059669,color:#fff
```

## 📦 Service Configuration

### Frontend Service
```
┌─────────────────────────────────┐
│  Railway Frontend Service       │
├─────────────────────────────────┤
│ Root Directory: /               │
│ Build: npm install && npm build │
│ Start: npm run preview          │
│ Port: $PORT (auto-assigned)     │
├─────────────────────────────────┤
│ Environment Variables:          │
│ • VITE_BACKEND_URL             │
│ • VITE_SUPABASE_URL            │
│ • VITE_SUPABASE_ANON_KEY       │
└─────────────────────────────────┘
```

### Backend Service
```
┌─────────────────────────────────┐
│  Railway Backend Service        │
├─────────────────────────────────┤
│ Root Directory: server/         │
│ Build: npm install              │
│ Start: npm start                │
│ Port: 3001                      │
├─────────────────────────────────┤
│ Environment Variables:          │
│ • PIXVERSE_API_KEY             │
│ • PORT                         │
│ • NODE_ENV                     │
└─────────────────────────────────┘
```

## 🔄 Request Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend<br/>(Railway)
    participant B as Backend<br/>(Railway)
    participant P as Pixverse API
    participant S as Supabase
    
    U->>F: Visit website
    F->>S: Fetch birthday data
    S-->>F: Return data
    F-->>U: Display page
    
    U->>F: Upload photo
    F->>B: POST /api/pixverse/upload-image
    B->>P: Upload image
    P-->>B: Return img_id
    B-->>F: Return img_id
    
    F->>B: POST /api/pixverse/generate-video
    B->>P: Generate video request
    P-->>B: Return video_id
    B-->>F: Return video_id
    
    loop Poll for completion
        F->>B: GET /api/pixverse/status/:videoId
        B->>P: Check status
        P-->>B: Status + URL
        B-->>F: Status + URL
    end
    
    F->>S: Save video URL
    S-->>F: Confirm saved
    F-->>U: Display video
```

## 🌐 Environment Variables Flow

```mermaid
graph LR
    subgraph "Development (.env)"
        A1[VITE_BACKEND_URL=<br/>localhost:3001]
        A2[PIXVERSE_API_KEY]
        A3[VITE_SUPABASE_URL]
    end
    
    subgraph "Railway Dashboard"
        B1[Frontend Env Vars]
        B2[Backend Env Vars]
    end
    
    subgraph "Production Build"
        C1[Baked into<br/>Frontend Bundle]
        C2[Runtime<br/>Backend Config]
    end
    
    A1 -->|Set in Railway| B1
    A2 -->|Set in Railway| B2
    A3 -->|Set in Railway| B1
    
    B1 -->|Build Time| C1
    B2 -->|Runtime| C2
    
    style B1 fill:#f59e0b,stroke:#d97706,color:#000
    style B2 fill:#f59e0b,stroke:#d97706,color:#000
```

## 📊 Deployment Steps Visualization

```mermaid
graph TD
    Start([Start Deployment]) --> Push[Push Code to GitHub]
    Push --> Backend[Deploy Backend Service]
    Backend --> BackendEnv[Set Backend Env Vars<br/>PIXVERSE_API_KEY]
    BackendEnv --> BackendDeploy[Backend Deploys]
    BackendDeploy --> GetURL[Copy Backend URL]
    
    GetURL --> Frontend[Deploy Frontend Service]
    Frontend --> FrontendEnv[Set Frontend Env Vars<br/>VITE_BACKEND_URL<br/>VITE_SUPABASE_URL]
    FrontendEnv --> FrontendDeploy[Frontend Deploys]
    FrontendDeploy --> Test{Test Both Services}
    
    Test -->|Success| Done([✅ Deployment Complete])
    Test -->|Fail| Debug[Check Logs & Debug]
    Debug --> Fix[Fix Issues]
    Fix --> Redeploy[Redeploy Service]
    Redeploy --> Test
    
    style Start fill:#10b981,stroke:#059669,color:#fff
    style Done fill:#10b981,stroke:#059669,color:#fff
    style BackendDeploy fill:#7c3aed,stroke:#5b21b6,color:#fff
    style FrontendDeploy fill:#7c3aed,stroke:#5b21b6,color:#fff
    style Debug fill:#ef4444,stroke:#dc2626,color:#fff
```

## 🔐 Security Best Practices

```mermaid
graph TB
    subgraph "✅ DO"
        A1[Store API keys in<br/>Railway Env Vars]
        A2[Use .gitignore for<br/>.env files]
        A3[Use HTTPS URLs]
        A4[Validate requests<br/>on backend]
    end
    
    subgraph "❌ DON'T"
        B1[Commit .env files<br/>to Git]
        B2[Hardcode API keys<br/>in code]
        B3[Expose backend<br/>endpoints publicly]
        B4[Skip CORS<br/>configuration]
    end
    
    style A1 fill:#10b981,stroke:#059669,color:#fff
    style A2 fill:#10b981,stroke:#059669,color:#fff
    style A3 fill:#10b981,stroke:#059669,color:#fff
    style A4 fill:#10b981,stroke:#059669,color:#fff
    
    style B1 fill:#ef4444,stroke:#dc2626,color:#fff
    style B2 fill:#ef4444,stroke:#dc2626,color:#fff
    style B3 fill:#ef4444,stroke:#dc2626,color:#fff
    style B4 fill:#ef4444,stroke:#dc2626,color:#fff
```

## 📈 Monitoring & Debugging

```mermaid
graph LR
    subgraph "Railway Dashboard"
        A[Deployments Tab]
        B[Logs Tab]
        C[Metrics Tab]
        D[Settings Tab]
    end
    
    A -->|View Build Status| E[Build Logs]
    B -->|Real-time Logs| F[Application Logs]
    C -->|Monitor Usage| G[CPU/Memory/Network]
    D -->|Configure| H[Env Vars & Commands]
    
    E --> I{Issue?}
    F --> I
    G --> I
    
    I -->|Build Error| J[Check package.json<br/>& dependencies]
    I -->|Runtime Error| K[Check env vars<br/>& API keys]
    I -->|Performance| L[Optimize code<br/>or upgrade plan]
    
    style I fill:#f59e0b,stroke:#d97706,color:#000
```

## 🎯 Key Points

1. **Two Separate Services**: Frontend and Backend are deployed as independent services
2. **Environment Variables**: Frontend vars are baked into build, Backend vars are runtime
3. **URL Configuration**: Backend URL must be set in Frontend env vars
4. **Auto-Deploy**: Railway auto-deploys on Git push (can be disabled)
5. **Logs**: Always check logs for debugging deployment issues

---

For detailed step-by-step instructions, see:
- [Railway Quick Start](./RAILWAY_QUICKSTART.md)
- [Full Deployment Guide](./RAILWAY_DEPLOYMENT_GUIDE.md)
