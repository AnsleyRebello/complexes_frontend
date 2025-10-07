# 🍃 Spring Boot Render Deployment Configuration

## Required Files for Your Spring Boot Project

### 1. application.properties (src/main/resources/)
```properties
# Server Configuration
server.port=${PORT:8080}
server.servlet.context-path=/

# Database Configuration (PostgreSQL on Render)
spring.datasource.url=${DATABASE_URL}
spring.datasource.driver-class-name=org.postgresql.Driver
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.format_sql=true

# Connection Pool Settings
spring.datasource.hikari.maximum-pool-size=5
spring.datasource.hikari.minimum-idle=2
spring.datasource.hikari.connection-timeout=20000
spring.datasource.hikari.idle-timeout=300000
spring.datasource.hikari.max-lifetime=1200000

# CORS Configuration
cors.allowed.origins=${FRONTEND_URL:http://localhost:3000}

# Logging
logging.level.org.springframework.web=INFO
logging.level.org.hibernate.SQL=DEBUG
logging.level.org.hibernate.type.descriptor.sql.BasicBinder=TRACE

# Production Profile
spring.profiles.active=production

# File Upload
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB
```

### 2. WebConfig.java (CORS Configuration)
```java
package com.clementregency.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

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
                
        // Allow all origins for health check
        registry.addMapping("/health")
                .allowedOrigins("*")
                .allowedMethods("GET");
    }
}
```

### 3. HealthController.java (Health Check Endpoint)
```java
package com.clementregency.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class HealthController {
    
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        Map<String, String> status = new HashMap<>();
        status.put("status", "UP");
        status.put("service", "Clement Regency Backend");
        status.put("timestamp", String.valueOf(System.currentTimeMillis()));
        return ResponseEntity.ok(status);
    }
    
    @GetMapping("/api/health")
    public ResponseEntity<Map<String, String>> apiHealth() {
        Map<String, String> status = new HashMap<>();
        status.put("status", "UP");
        status.put("api", "Ready");
        status.put("timestamp", String.valueOf(System.currentTimeMillis()));
        return ResponseEntity.ok(status);
    }
}
```

### 4. pom.xml Dependencies
```xml
<dependencies>
    <!-- Spring Boot Starter Web -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    
    <!-- Spring Boot Starter Data JPA -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    
    <!-- PostgreSQL Driver -->
    <dependency>
        <groupId>org.postgresql</groupId>
        <artifactId>postgresql</artifactId>
        <scope>runtime</scope>
    </dependency>
    
    <!-- Spring Boot Starter Security (if needed) -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-security</artifactId>
    </dependency>
    
    <!-- JWT Dependencies (if using JWT) -->
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-api</artifactId>
        <version>0.11.5</version>
    </dependency>
    
    <!-- Spring Boot Starter Validation -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-validation</artifactId>
    </dependency>
    
    <!-- Spring Boot Starter Test -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId>
        <scope>test</scope>
    </dependency>
</dependencies>

<build>
    <plugins>
        <plugin>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-maven-plugin</artifactId>
        </plugin>
    </plugins>
</build>

<properties>
    <maven.compiler.source>17</maven.compiler.source>
    <maven.compiler.target>17</maven.compiler.target>
    <java.version>17</java.version>
</properties>
```

### 5. Application.java (Main Class)
```java
package com.clementregency;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ClementRegencyApplication {
    public static void main(String[] args) {
        SpringApplication.run(ClementRegencyApplication.class, args);
    }
}
```

## 📋 Render Environment Variables

Set these in your Render Web Service dashboard:

```env
# Database (if using Render PostgreSQL)
DATABASE_URL=postgresql://username:password@host:port/database

# Frontend URL (your Vercel deployment)
FRONTEND_URL=https://your-frontend-app.vercel.app

# Server Configuration
PORT=8080
JAVA_TOOL_OPTIONS=-Xmx512m

# JWT Secret (if using JWT authentication)
JWT_SECRET=your-super-secret-jwt-key-here

# Email Configuration (if using)
SPRING_MAIL_HOST=smtp.gmail.com
SPRING_MAIL_PORT=587
SPRING_MAIL_USERNAME=your-email@gmail.com
SPRING_MAIL_PASSWORD=your-app-password
```

## 🚀 Render Deployment Steps

### 1. Prepare Repository
```bash
# Ensure all files are committed
git add .
git commit -m "feat: configure for Render deployment"
git push origin main
```

### 2. Create Render Service
1. Go to [render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `clement-regency-backend`
   - **Environment**: `Java`
   - **Build Command**: `./mvnw clean package -DskipTests`
   - **Start Command**: `java -jar target/*.jar`

### 3. Add Environment Variables
Add all the environment variables listed above in the Render dashboard.

### 4. Deploy
Click "Create Web Service" and wait for deployment to complete.

## 🧪 Testing Your Deployment

### Health Check
```bash
curl https://your-backend-service.onrender.com/health
```

Expected response:
```json
{
  "status": "UP",
  "service": "Clement Regency Backend",
  "timestamp": "1234567890"
}
```

### API Endpoints
```bash
# Test API health
curl https://your-backend-service.onrender.com/api/health

# Test buildings endpoint (should return empty array or data)
curl https://your-backend-service.onrender.com/api/buildings
```

## 🛠️ Troubleshooting

### Common Build Issues
1. **Java Version Mismatch**: Ensure Java 17 in pom.xml
2. **Missing Dependencies**: Check PostgreSQL driver is included
3. **Memory Issues**: Add `JAVA_TOOL_OPTIONS=-Xmx512m`

### Runtime Issues
1. **Database Connection**: Verify DATABASE_URL format
2. **CORS Errors**: Check FRONTEND_URL environment variable
3. **Cold Starts**: First request may take 30+ seconds

### Logs
Check Render logs for detailed error messages:
1. Go to your service dashboard
2. Click "Logs" tab
3. Look for startup errors or exceptions

## 📊 Performance Tips

### Optimize Startup Time
```properties
# Add to application.properties
spring.jpa.defer-datasource-initialization=true
spring.jpa.hibernate.ddl-auto=validate
spring.jackson.serialization.fail-on-empty-beans=false
```

### Database Optimization
```properties
# Connection pool optimization
spring.datasource.hikari.maximum-pool-size=3
spring.datasource.hikari.minimum-idle=1
spring.datasource.hikari.connection-timeout=10000
```

---

**Your Spring Boot backend is now ready for Render! 🚀**