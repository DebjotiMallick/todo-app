pipeline {
    agent any

    environment {
        REGISTRY_URL   = "registry.digitalocean.com"
        REGISTRY_NAME  = "debjotimallick"
        IMAGE_NAME     = "todoapp-backend"
        DOCKER_CREDS   = "DOCKER_CREDS"
        COMMIT_SHA     = "${env.GIT_COMMIT.take(7)}"
        IMAGE_TAG      = "${REGISTRY_URL}/${REGISTRY_NAME}/${IMAGE_NAME}:${COMMIT_SHA}"
        LATEST_TAG     = "${REGISTRY_URL}/${REGISTRY_NAME}/${IMAGE_NAME}:latest"
    }

    stages {
        stage('Checkout SCM') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker') {
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

        stage('Push to Container Registry') {
            steps {
                withCredentials([usernamePassword(credentialsId: DOCKER_CREDS, usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh '''
                        echo "Logging in to DOCR..."
                        echo "$DOCKER_PASS" | docker login "$REGISTRY_URL" -u "$DOCKER_USER" --password-stdin

                        echo "Pushing image..."
                        docker push $IMAGE_TAG
                        docker push $LATEST_TAG

                        docker logout "$REGISTRY_URL"
                    '''
                }
            }
        }
    }

    post {
        success {
            echo "Docker image pushed successfully: $IMAGE_TAG"
        }
        failure {
            echo "Build or push failed."
        }
        cleanup {
            cleanWs()
        }
    }
}