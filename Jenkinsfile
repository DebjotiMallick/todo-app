pipeline {
    agent any

    environment {
        REGISTRY_URL   = "docker.io"
        REGISTRY_NAME  = "debjotimallick"
        BACKEND_IMAGE  = "todo-app-backend"
        FRONTEND_IMAGE = "todo-app-frontend"
        DOCKER_CREDS   = "DOCKER_CREDS"
    }

    options {
        skipDefaultCheckout true 
    }

    stages {
        stage('Check Tag Trigger') {
            steps {
                script {
                    def tag = sh(returnStdout: true, script: "git describe --tags --exact-match || true").trim()
                    if (tag) {
                        echo "Detected tag build: ${tag}"
                        env.IS_TAG_BUILD = "true"
                        env.IMAGE_TAG = tag
                    } else {
                        echo "Not a tag build — skipping pipeline."
                        currentBuild.result = 'ABORTED'
                        error("Aborting non-tag build.")
                    }
                }
            }
        }

        stage('Checkout SCM') {
            steps {
                checkout scm
            }
        }

        stage('Determine Image Tag') {
            steps {
                script {
                    // Get the current tag 
                    def tag = sh(returnStdout: true, script: 'git describe --tags --exact-match').trim()
                    env.IMAGE_TAG = tag
                    env.BACKEND_TAG = "${env.REGISTRY_URL}/${env.REGISTRY_NAME}/${env.BACKEND_IMAGE}:${tag}"
                    env.BACKEND_LATEST = "${env.REGISTRY_URL}/${env.REGISTRY_NAME}/${env.BACKEND_IMAGE}:latest"
                    env.FRONTEND_TAG = "${env.REGISTRY_URL}/${env.REGISTRY_NAME}/${env.FRONTEND_IMAGE}:${tag}"
                    env.FRONTEND_LATEST = "${env.REGISTRY_URL}/${env.REGISTRY_NAME}/${env.FRONTEND_IMAGE}:latest"
                    echo "Using image tag: ${env.IMAGE_TAG}"
                }
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
                                docker build --build-arg VITE_API_BASE_URL=/api -t $FRONTEND_TAG .
                                docker tag $FRONTEND_TAG $FRONTEND_LATEST
                            '''
                        }
                    }
                }
            }
        }

        stage('Push to Container Registry') {
            parallel {
                stage('Push Backend') {
                    steps {
                        withCredentials([usernamePassword(credentialsId: DOCKER_CREDS, usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                            sh '''
                                echo "Logging in to Container Registry..."
                                echo "$DOCKER_PASS" | docker login "$REGISTRY_URL" -u "$DOCKER_USER" --password-stdin

                                echo "Pushing Backend image..."
                                docker push $BACKEND_TAG
                                docker push $BACKEND_LATEST

                                docker logout "$REGISTRY_URL"
                            '''
                        }
                    }
                }
                stage('Push Frontend') {
                    steps {
                        withCredentials([usernamePassword(credentialsId: DOCKER_CREDS, usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                            sh '''
                                echo "Logging in to Container Registry..."
                                echo "$DOCKER_PASS" | docker login "$REGISTRY_URL" -u "$DOCKER_USER" --password-stdin

                                echo "Pushing Frontend image..."
                                docker push $FRONTEND_TAG
                                docker push $FRONTEND_LATEST

                                docker logout "$REGISTRY_URL"
                            '''
                        }
                    }
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