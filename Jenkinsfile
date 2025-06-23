pipeline {
    agent any

    environment {
        REGISTRY_URL   = "registry.digitalocean.com"
        REGISTRY_NAME  = "debjotimallick"
        BACKEND_IMAGE  = "todoapp-backend"
        FRONTEND_IMAGE = "todoapp-frontend"
        DOCKER_CREDS   = "DOCKER_CREDS"
        COMMIT_SHA     = "${env.GIT_COMMIT.take(7)}"
        BACKEND_TAG    = "${REGISTRY_URL}/${REGISTRY_NAME}/${BACKEND_IMAGE}:${COMMIT_SHA}"
        BACKEND_LATEST = "${REGISTRY_URL}/${REGISTRY_NAME}/${BACKEND_IMAGE}:latest"
        FRONTEND_TAG   = "${REGISTRY_URL}/${REGISTRY_NAME}/${FRONTEND_IMAGE}:${COMMIT_SHA}"
        FRONTEND_LATEST= "${REGISTRY_URL}/${REGISTRY_NAME}/${FRONTEND_IMAGE}:latest"
    }

    stages {
        stage('Checkout SCM') {
            steps {
                checkout scm
            }
        }

        stage('Build') {
            parallel {
                stage('Build Backend') {
                    steps {
                        dir('backend') {
                            sh '''
                                echo "Building Backend Docker image..."
                                docker build -t $BACKEND_TAG .
                                docker tag $BACKEND_TAG $BACKEND_LATEST
                            '''
                        }
                    }
                }
                stage('Build Frontend') {
                    steps {
                        dir('frontend') {
                            sh '''
                                echo "Building Frontend Docker image..."
                                docker build --build-arg VITE_API_BASE_URL=http://todoapp-backend:8000 -t $FRONTEND_TAG .
                                docker tag $FRONTEND_TAG $FRONTEND_LATEST
                            '''
                        }
                    }
                }
            }
        }

        stage('Push to Container Registry') {
            steps {
                withCredentials([usernamePassword(credentialsId: DOCKER_CREDS, usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh '''
                        echo "Logging in to DOCR..."
                        echo "$DOCKER_PASS" | docker login "$REGISTRY_URL" -u "$DOCKER_USER" --password-stdin

                        echo "Pushing Backend image..."
                        docker push $BACKEND_TAG
                        docker push $BACKEND_LATEST

                        echo "Pushing Frontend image..."
                        docker push $FRONTEND_TAG
                        docker push $FRONTEND_LATEST

                        docker logout "$REGISTRY_URL"
                    '''
                }
            }
        }
    }


    post {
        success {
            echo "Docker images pushed successfully"
            echo "Backend: $BACKEND_TAG"
            echo "Frontend: $FRONTEND_TAG"
        }
        failure {
            echo "Build or push failed."
        }
        cleanup {
            cleanWs()
        }
    }
}