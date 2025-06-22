pipeline {
    agent any

    environment {
        REGISTRY       = "registry.digitalocean.com/debjotimallick"
        IMAGE_NAME     = "todoapp-backend"
        DOCKER_CREDS   = "DOCR_PAT"
        COMMIT_SHA     = "${env.GIT_COMMIT.take(7)}"
        IMAGE_TAG      = "${REGISTRY}/${IMAGE_NAME}:${COMMIT_SHA}"
        LATEST_TAG     = "${REGISTRY}/${IMAGE_NAME}:latest"
    }

    stages {
        stage('Checkout SCM') {
            steps {
                checkout scm
            }
        }

        stage('Build Backend Image') {
            steps {
                dir('backend') {
                    sh '''
                        echo "Building Docker image..."
                        docker build -t $IMAGE_TAG .
                        docker tag $IMAGE_TAG $LATEST_TAG
                    '''
                }
            }
        }

        stage('Push to DigitalOcean CR') {
            steps {
                withCredentials([string(credentialsId: DOCKER_CREDS, variable: 'DOCR_PAT')]) {
                    sh '''
                        echo "Logging in to DOCR..."
                        echo $DOCR_PAT | docker login registry.digitalocean.com -u "doctl" --password-stdin

                        echo "Pushing image..."
                        docker push $IMAGE_TAG
                        docker push $LATEST_TAG

                        docker logout registry.digitalocean.com
                    '''
                }
            }
        }
    }

    post {
        success {
            echo "✅ Docker image pushed successfully: $IMAGE_TAG"
        }
        failure {
            echo "❌ Build or push failed."
        }
        cleanup {
            cleanWs()
        }
    }
}