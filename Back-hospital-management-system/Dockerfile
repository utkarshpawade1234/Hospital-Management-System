# ---------- STAGE 1: BUILD ----------
FROM maven:3.9.9-eclipse-temurin-21 AS builder

WORKDIR /app

# Copy only required files first (better caching)
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy source code
COPY src ./src

# Build jar
RUN mvn clean package -DskipTests

FROM eclipse-temurin:21-jdk

WORKDIR /app

# Copy only jar (NOT source code)
COPY --from=builder /app/target/hospital-management-system-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]