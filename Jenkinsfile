pipeline {
    agent any

    environment {
        DEPLOY_DIR = "/opt/capstone/deploy"
        GIT_BRANCH = "main"
        DOCKER_TAG = "latest"
    }

    stages {
        stage('Git Clone') {
            steps {
                script {
                    git branch: "${GIT_BRANCH}", credentialsId: 'gitlab', url: 'https://git.chosun.ac.kr/iap1-2025/class-06/team-08.git'
                }
            }
        }

        // 적용 브랜치 확인
        stage('Show Git Branch') {
            steps {
                script {
                    def branch = sh(script: 'git rev-parse --abbrev-ref HEAD', returnStdout: true).trim()
                    echo "Current Git Branch: ${branch}"
                }
            }
        }

        // Clone Repository 구조 확인
        stage('Show Directory Structure') {
            steps {
                script {
                    sh 'find .'
                }
            }
        }

        stage('Show Frontend Dockerfile') {
            steps {
                script {
                    def dockerfilePath = "frontend/Dockerfile"
                    def dockerfileExists = fileExists(dockerfilePath)
        
                    if (dockerfileExists) {
                        echo "Dockerfile for frontend exists, displaying content."
                        sh "cat ${dockerfilePath}"
                    } else {
                        echo "Dockerfile for frontend does not exist, skipping."
                    }
                }
            }
        }
        
        stage('Show Backend Dockerfiles') {
            steps {
                script {
                    def services = ['ai', 'grading', 'member', 'review', 'workbook']
                    for (service in services) {
                        def dockerfilePath = "backend/${service}/Dockerfile"
                        def dockerfileExists = fileExists(dockerfilePath)
        
                        if (dockerfileExists) {
                            echo "Dockerfile for ${service} exists, displaying content."
                            sh "cat ${dockerfilePath}"
                        } else {
                            echo "Dockerfile for ${service} does not exist, skipping."
                        }
                    }
                }
            }
        }


        stage('Show Docker Compose File') {
            steps {
                script {
                    def dockerComposeFilePath = "${WORKSPACE}/docker-compose.yml"
                    def dockerComposeFileExists = fileExists(dockerComposeFilePath)

                    if (dockerComposeFileExists) {
                        echo "docker-compose.yml exists, displaying content."
                        sh "cat ${dockerComposeFilePath}"
                    } else {
                        echo "docker-compose.yml does not exist."
                    }
                }
            }
        }

        stage('Build Frontend Docker Image') {
            steps {
                script {
                    def image = "frontend:${DOCKER_TAG}"
                    def dockerfilePath = "frontend/Dockerfile"
        
                    if (fileExists(dockerfilePath)) {
                        echo "Dockerfile for frontend exists, proceeding with build."
                        sh """
                            docker build -t ${image} -f ${dockerfilePath} frontend
                        """
                    } else {
                        echo "Dockerfile for frontend does not exist, skipping."
                    }
                }
            }
        }
        
        stage('Build Backend Docker Images') {
            steps {
                script {
                    def services = ['ai', 'grading', 'member', 'review', 'workbook']
                    for (service in services) {
                        def image = "${service}:${DOCKER_TAG}"
                        def dockerfilePath = "backend/${service}/Dockerfile"
        
                        if (fileExists(dockerfilePath)) {
                            echo "Dockerfile for ${service} exists, proceeding with build."
                            sh """
                                docker build -t ${image} -f ${dockerfilePath} backend/${service}
                            """
                        } else {
                            echo "Dockerfile for ${service} does not exist, skipping."
                        }
                    }
                }
            }
        }


        stage('Deploy') {
            steps {
                script {
                    sh """
                    echo "Current User: \$(whoami)"
                    if [ ! -d "${DEPLOY_DIR}" ]; then
                        mkdir -p ${DEPLOY_DIR}
                    fi

                    cd ${DEPLOY_DIR}

                    cp ${WORKSPACE}/docker-compose.yml ${DEPLOY_DIR}/

                    echo "Directory Contents:"
                    ls -al

                    if [ -f "docker-compose.yml" ]; then
                        echo "docker-compose.yml exists."
                        cat docker-compose.yml
                    else
                        echo "docker-compose.yml does not exist."
                        exit 1
                    fi

                    if [ ! -d "${DEPLOY_DIR}/exec/sql" ]; then
                        mkdir -p "${DEPLOY_DIR}/exec/sql"
                    fi

                    cp ${WORKSPACE}/exec/sql/init.sql ${DEPLOY_DIR}/exec/sql/init.sql

                    docker compose down
                    docker compose up --build -d
                    """
                }
            }
        }


        // 필요 없는 도커 이미지 삭제
        stage('Docker Cleanup') {   
            steps {
                script {
                    sh """
                    echo "Cleaning up old Docker images..."
                    
                    docker image prune -a
                    """
                }
            }
        }
        }
    
    post {
        always {
            echo "Cleaning up.."
            
            // 빌드 결과물, 로그, 캐시 파일 등을 삭제(빌드 꼬임 및 오류 방지)
            cleanWs()
        }
        success {
            echo 'Pipeline succeeded!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}

