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
        when {
            anyOf {
                changeset "**"
                not { changeset "k8s/**" }
                not { changeset "Jenkinsfile" }
                not { changeset "README.md" }
                not { changeset "docker-compose.yml" }
                not { changeset ".gitignore" }
            }
        }
        stage('Checkout SCM') {
            steps {
                checkout scm
            }
        }

        stage('Build') {
            parallel {
                stage('Build Backend') {
                    when {
                        anyOf {
                            changeset "backend/**"
                        }
                    }
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
                    when {
                        anyOf {
                            changeset "frontend/**"
                        }
                    }
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
                    when {
                        anyOf {
                            changeset "backend/**"
                        }
                    }
                    steps {
                        withCredentials([usernamePassword(credentialsId: DOCKER_CREDS, usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                            sh '''
                                echo "Logging in to DOCR..."
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
                    when {
                        anyOf {
                            changeset "frontend/**"
                        }
                    }
                    steps {
                        withCredentials([usernamePassword(credentialsId: DOCKER_CREDS, usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                            sh '''
                                echo "Logging in to DOCR..."
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

        stage('Update image tag in GitHub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'GIT_CREDS', usernameVariable: 'GIT_USERNAME', passwordVariable: 'GIT_PASSWORD')]) {
                    sh '''
                        # Update backend image tag
                        sed -i "s|image: registry.digitalocean.com/debjotimallick/todoapp-backend:[a-z0-9]*|image: ${BACKEND_TAG}|" k8s/backend.yaml
                                
                        # Update frontend image tag
                        sed -i "s|image: registry.digitalocean.com/debjotimallick/todoapp-frontend:[a-z0-9]*|image: ${FRONTEND_TAG}|" k8s/frontend.yaml
                        
                        # Configure git
                        git config --global user.name "${GIT_USERNAME}"
                        git config --global user.email "debjoti.mallick@hotmail.com"
                            
                        # Commit and push changes
                        git add k8s/backend.yaml k8s/frontend.yaml
                        git commit -m "Update image tags to ${COMMIT_SHA} [skip ci]" || echo "No changes to commit"
                        
                        # Push changes back to the repository
                        git remote set-url origin https://${GIT_USERNAME}:${GIT_PASSWORD}@github.com/${GIT_USERNAME}/todo-app.git
                        git push origin HEAD:main
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