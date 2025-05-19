pipeline {
    agent any

    environment {
        DEPLOY_DIR = "/home/controller/deploy"
        GIT_BRANCH = "cicd-test"
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

        stage('Show Dockerfiles') {
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

        stage('Build Docker Images') {
            steps {
                script {
                    def services = ['ai', 'grading', 'member', 'review', 'workbook']
                    for (service in services) {
                        def image = "${service}:${DOCKER_TAG}"
                        def dockerfilePath = "backend/${service}/Dockerfile"

                        // Check if Dockerfile exists
                        def dockerfileExists = fileExists(dockerfilePath)

                        if (dockerfileExists) {
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

                    docker-compose down
                    docker-compose up --build -d
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

                    docker images 
                        --filter "dangling=false" 
                        --format "{{.ID}}:{{.Tag}}" 
                        | grep -v ":${DOCKER_TAG}" 
                        | awk -F ':' '{print \$1}' 
                        | xargs -r docker rmi
                    """
                    /**
                     dangling : 태그가 없는 이미지는 제외
                     --format "{{.ID}}:{{.Tag}}" : id:tag 형태로 보이도록 지정                    
                     | grep -v : 현재 사용중인 태그가 아닌 이미지만 선택
                     | awk -F ':' '{print \$1}' : :로 나눈 것 중 앞부분을 가져옴(삭제할 이미지 ID)
                     | xargs -r docker rmi: 이미지 ID들을 하나씩 docker rmi 명령으로 삭제
                    **/
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

