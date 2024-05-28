pipeline {

    environment {
        ecrRegistry = credentials('ECR_REGISTRY')
        ecrRepository = credentials('ECR_REPOSITORY')
        awsRegion = credentials('AWS_REGION')
        dockerImage = ''
        deploymentFile = './app/k8s/deployment.yaml'
    }

    agent any
    
    stages {
        stage('Atualizar arquivo .env') {
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
        }

        stage('Build do Docker') {
            steps {
                script {
                    dockerImage = docker.build("$ecrRegistry/$ecrRepository:${env.GIT_COMMIT}", '-f ./app/Dockerfile ./app')
                }
            }
        }

        stage('Push do Docker para o ECR') {
            steps {
                script {
                    docker.withRegistry("https://$ecrRegistry/$ecrRepository", "ecr:$awsRegion:aws-access-key") {
                        dockerImage.push()
                    }
                }            
            }
        }

        stage('Deploy do Kubernetes no EKS') {
            steps {
                withCredentials([aws(accessKeyVariable: 'AWS_ACCESS_KEY_ID', credentialsId: 'aws-access-key', secretKeyVariable: 'AWS_SECRET_ACCESS_KEY')]) {

                    sh "aws eks list-clusters --region $awsRegion"

                    withKubeConfig(caCertificate: '', clusterName: '', contextName: '', credentialsId: 'kubeconfig', namespace: '', restrictKubeConfigAccess: false, serverUrl: '') {
                        sh 'kubectl get pods'
                        sh "sed -i 's/ECR_REGISTRY/'$ecrRegistry'/g' $deploymentFile"
                        sh "sed -i 's/ECR_REPOSITORY/'$ecrRepository'/g' $deploymentFile"
                        sh "sed -i 's/IMAGE_TAG/'${env.GIT_COMMIT}'/g' $deploymentFile"
                        sh "cat $deploymentFile"
                        sh "kubectl apply -f $deploymentFile"
                    }

                }
            }
        }
    }

}