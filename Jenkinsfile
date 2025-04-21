pipeline {
  agent any

  environment {
    REGISTRY="registry.gitlab.com/mkdev8793416/ec_ticketing_microservices"
    IMAGE_TAG="latest"
    SERVICE_NAME="auth"
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Install & Test') {
      steps {
        dir('auth') {
          sh 'npm install'
          sh 'npm run test:ci'
        }
      }
    }

    stage('Build & Push Docker Image To Gitlab Registry') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'gitlab-docker-creds', usernameVariable: 'GITLAB_USER', passwordVariable: 'GITLAB_TOKEN')]) {
          sh """
            docker login -u $GITLAB_USER -p $GITLAB_TOKEN $REGISTRY
            docker build -t $REGISTRY/$SERVICE_NAME:$IMAGE_TAG ./auth
            docker push $REGISTRY/$SERVICE_NAME:$IMAGE_TAG
          """
        }
      }
    }

    stage('Deploy To Local Kubernetes') {
      steps {
        sh 'kubectl apply -f infra/k8s/auth-depl.yaml'
      }
    }
  }
}