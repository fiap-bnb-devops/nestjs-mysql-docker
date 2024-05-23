pipeline {

    agent any
    
    stages {
        stage('Build do Docker') {
            steps {
                script {
                    docker.build("471112647960.dkr.ecr.us-east-2.amazonaws.com/nestjs-api-docker:${env.GIT_COMMIT}", '-f ./app/Dockerfile ./app')
                }
            }
        }

        stage('Push do Docker para o ECR') {}

        stage('Deploy do Kubernetes no EKS') {}
    }

}