pipeline {

    environment {
        amazonEcr = credentials('AMAZON_ECR')
        awsRegion = credentials('AWS_REGION')
        dockerImage = ''
    }

    agent any
    
    stages {
        /*stage('Atualizar arquivo .env') {
            steps {
                withCredentials([
                    string(credentialsId: 'DATABASE_USER', variable: 'DATABASE_USER'),
                    string(credentialsId: 'DATABASE_PASSWORD', variable: 'DATABASE_PASSWORD'),
                    string(credentialsId: 'DATABASE_HOST', variable: 'DATABASE_HOST'),
                    string(credentialsId: 'DATABASE_PORT', variable: 'DATABASE_PORT'),
                    string(credentialsId: 'DATABASE_NAME', variable: 'DATABASE_NAME')
                ]) {
    
                    sh 'echo "DATABASE_URL=\"mysql://$DATABASE_USER:$DATABASE_PASSWORD@$DATABASE_HOST:$DATABASE_PORT/$DATABASE_NAME"\" >> ./app/.env'

                }
            }
        }*/

        stage('Build do Docker') {
            steps {
                script {
                    dockerImage = docker.build("$amazonEcr:${env.GIT_COMMIT}", '-f ./app/Dockerfile ./app')
                }
            }
        }

        stage('Push do Docker para o ECR') {
            steps {
                script {
                    docker.withRegistry("https://$amazonEcr", "ecr:$awsRegion:aws-access-key") {
                        dockerImage.push()
                    }
                }            
            }
        }

        stage('Deploy do Kubernetes no EKS') {
            steps {
                echo "Deploy do Kubernetes no EKS"
            }
        }
    }

}