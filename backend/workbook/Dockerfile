FROM openjdk:17-jdk-slim

WORKDIR /app

COPY . .

RUN sed -i 's/\r$//' gradlew
RUN chmod +x ./gradlew

RUN ./gradlew clean build -x test --stacktrace

RUN mv build/libs/*SNAPSHOT.jar /app/app.jar

ENTRYPOINT ["java", "-jar", "-Dspring.profiles.active=dev", "app.jar"]