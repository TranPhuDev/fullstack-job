# Stage 1: Build the application
FROM gradle:8.7-jdk17 AS build
COPY --chown=gradle:gradle . /tranphudev/jobhunter
WORKDIR /tranphudev/jobhunter

#skip task: test
RUN gradle clean build -x test --no-daemon

# Stage 2: Run the application
FROM openjdk:17-slim
EXPOSE 8080
COPY --from=build /tranphudev/jobhunter/build/libs/*.jar /tranphudev/spring-boot-job-hunter.jar
ENTRYPOINT ["java", "-jar", "/tranphudev/spring-boot-job-hunter.jar"]
