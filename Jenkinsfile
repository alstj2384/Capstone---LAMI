pipeline {
    agent any

    environment {
        DEPLOY_DIR = "/home/capstone/deploy"
        GIT_BRANCH = "main"
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

        // stage('Build Docker Images') {
        //     steps {

        //     }
        // }

        // stage('Deploy') {
        //     steps {

        //     }
        // }

        // stage('Docker Cleanup') {
        //     steps {

        //     }
        // }
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

