FROM openjdk:17-jdk-slim

WORKDIR /app

COPY . .

RUN sed -i 's/\r$//' gradlew

# gradlew 실행 권한 부여 및 빌드 (test 제외)
RUN chmod +x ./gradlew
RUN ./gradlew clean build -x test --stacktrace

RUN mv build/libs/*SNAPSHOT.jar /app/app.jar

# dev profile로 실행
ENTRYPOINT ["java", "-jar", "-Dspring.profiles.active=dev", "app.jar"]
