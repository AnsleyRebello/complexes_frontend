# 🚀 Spring Boot (Render) + React (Vercel) Deployment Guide

## Overview
This guide covers deploying your Spring Boot backend to Render and React frontend to Vercel, with proper integration between both services.

## 📋 Architecture
```
┌─────────────────┐    HTTPS API Calls    ┌──────────────────┐
│   React App     │ ──────────────────── │ Spring Boot API  │
│   (Vercel)      │                      │    (Render)      │
│ your-app.vercel │                      │ your-api.render  │
└─────────────────┘                      └──────────────────┘
```

## 🎯 Part 1: Backend Deployment (Render)

### Prerequisites
- Spring Boot project ready
- GitHub repository for your backend
- Render account (free)

### Step 1: Prepare Spring Boot for Render

#### Update `application.properties`:
```properties
# Server configuration
server.port=${PORT:8080}

# Database configuration (use Render PostgreSQL)
spring.datasource.url=${DATABASE_URL}
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}
spring.jpa.hibernate.ddl-auto=update
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect

# CORS configuration for your Vercel frontend
cors.allowed.origins=${FRONTEND_URL:http://localhost:3000}

# Profile
spring.profiles.active=production
```

#### Add CORS Configuration Class:
```java
@Configuration
@EnableWebMvc
public class WebConfig implements WebMvcConfigurer {
    
    @Value("${cors.allowed.origins}")
    private String allowedOrigins;
    
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins(allowedOrigins.split(","))
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }
}
```

#### Update `pom.xml` (if using Maven):
```xml
<properties>
    <maven.compiler.source>17</maven.compiler.source>
    <maven.compiler.target>17</maven.compiler.target>
</properties>

<build>
    <plugins>
        <plugin>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-maven-plugin</artifactId>
        </plugin>
    </plugins>
</build>
```

### Step 2: Deploy to Render

#### 2.1 Create Web Service
1. Go to [render.com](https://render.com)
2. Sign in with GitHub
3. Click **"New +"** → **"Web Service"**
4. Connect your Spring Boot repository

#### 2.2 Configure Service
- **Name**: `your-backend-service` (remember this name)
- **Environment**: `Java`
- **Build Command**: `./mvnw clean package -DskipTests`
- **Start Command**: `java -jar target/*.jar`
- **Instance Type**: `Free`

#### 2.3 Environment Variables
Add these in Render dashboard:
```env
DATABASE_URL=postgresql://username:password@host:port/database
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password
FRONTEND_URL=https://your-frontend-app.vercel.app
PORT=8080
JAVA_TOOL_OPTIONS=-Xmx512m
```

#### 2.4 Add Database (Optional)
1. Click **"New +"** → **"PostgreSQL"**
2. Copy connection details to environment variables
3. Update `DATABASE_URL` in your web service

### Step 3: Test Backend
- Your API will be available at: `https://your-backend-service.onrender.com`
- Test endpoint: `https://your-backend-service.onrender.com/api/health`

## 🎯 Part 2: Frontend Deployment (Vercel)

### Step 1: Update Environment Variables
In your React project's Vercel dashboard:
```env
VITE_API_BASE_URL=https://your-backend-service.onrender.com/api
VITE_ADMIN_EMAIL=gonsalvessaviyan@gmail.com
VITE_COMPANY_EMAIL=info@clementregency.com
VITE_COMPANY_PHONE=+91-XXXXXXXXXX
VITE_DEMO_USER_EMAIL=demo@clementregency.com
VITE_DEMO_ADMIN_EMAIL=admin@clementregency.com
VITE_EMAILJS_SERVICE_ID=service_bszdhqg
VITE_EMAILJS_PUBLIC_KEY=your_public_key_here
VITE_EMAILJS_ADMIN_TEMPLATE=your_admin_template_id
VITE_EMAILJS_USER_TEMPLATE=your_user_template_id
VITE_APP_NAME=Clement Regency Developers
```

### Step 2: Deploy to Vercel
1. Push your React code to GitHub
2. Connect repository to Vercel
3. Deploy automatically

## 🔧 Part 3: Integration & Testing

### Update Backend CORS
Once you have your Vercel URL, update the backend environment variable:
```env
FRONTEND_URL=https://your-frontend-app.vercel.app
```

### Test Integration
1. **Frontend loads**: ✅ `https://your-frontend-app.vercel.app`
2. **Backend responds**: ✅ `https://your-backend-service.onrender.com/api`
3. **CORS working**: ✅ API calls from frontend work
4. **Database connected**: ✅ Data persists between requests

## 🛠️ Troubleshooting

### Common Issues

#### 1. CORS Errors
```java
// Add this to your Spring Boot main class
@CrossOrigin(origins = "https://your-frontend-app.vercel.app")
@RestController
public class YourController {
    // Your endpoints
}
```

#### 2. Render Cold Starts
- Free tier has ~30s cold start delay
- First request after inactivity may timeout
- Consider upgrading to paid tier for production

#### 3. Database Connection Issues
```properties
# Add these properties for better connection handling
spring.datasource.hikari.maximum-pool-size=5
spring.datasource.hikari.minimum-idle=2
spring.datasource.hikari.connection-timeout=20000
```

#### 4. Build Failures on Render
```bash
# Common fixes in build command
./mvnw clean package -DskipTests -Dmaven.javadoc.skip=true
```

### Environment-Specific API Calls
Your React app will automatically use the correct API URL:
- **Development**: `http://localhost:8080/api`
- **Production**: `https://your-backend-service.onrender.com/api`

## 📊 Performance Optimization

### Backend (Render)
```properties
# Add to application.properties
spring.jpa.properties.hibernate.jdbc.batch_size=20
spring.jpa.properties.hibernate.order_inserts=true
spring.jpa.properties.hibernate.order_updates=true
spring.jpa.properties.hibernate.jdbc.batch_versioned_data=true
```

### Frontend (Vercel)
- Already optimized with code splitting
- Vercel provides CDN automatically
- Gzip compression enabled

## 🚀 Deployment Checklist

### Backend (Render) ✅
- [ ] Spring Boot app builds successfully
- [ ] Environment variables configured
- [ ] Database connected (if using)
- [ ] CORS configured for Vercel domain
- [ ] Health endpoint working
- [ ] API endpoints responding

### Frontend (Vercel) ✅
- [ ] React app builds successfully
- [ ] Environment variables set
- [ ] API calls point to Render backend
- [ ] All routes work (SPA routing)
- [ ] Authentication flow works
- [ ] Email notifications configured

### Integration ✅
- [ ] Frontend can reach backend
- [ ] CORS working properly
- [ ] Database operations successful
- [ ] User authentication working
- [ ] All features functional

## 💰 Cost Considerations

### Free Tier Limits
- **Render**: 750 hours/month, auto-sleep after 15 mins
- **Vercel**: 100GB bandwidth, unlimited requests

### Production Ready
- **Render**: $7/month for always-on service
- **Vercel**: Free tier usually sufficient for frontend

## 🔒 Security Best Practices

### Backend
```java
// Add security headers
@Configuration
public class SecurityConfig {
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.headers().frameOptions().deny()
            .contentTypeOptions().and()
            .httpStrictTransportSecurity(hstsConfig -> hstsConfig
                .maxAgeInSeconds(31536000)
                .includeSubdomains(true));
        return http.build();
    }
}
```

### Environment Variables
- Never commit sensitive data
- Use Render's environment variables
- Rotate keys regularly

## 🎉 Success!

Your full-stack application is now deployed:
- **Frontend**: `https://your-frontend-app.vercel.app`
- **Backend**: `https://your-backend-service.onrender.com`

## 📞 Support Resources

- **Render Docs**: [render.com/docs](https://render.com/docs)
- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Spring Boot**: [spring.io/projects/spring-boot](https://spring.io/projects/spring-boot)

---

**Happy Deploying! 🚀**