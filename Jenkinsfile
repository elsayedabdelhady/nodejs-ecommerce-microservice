pipeline {
    agent any

    environment {
        DOCKER_REGISTRY = 'docker.io'
        DOCKER_REPO = 'your-username'
        KUBECONFIG_PATH = credentials('kubeconfig')
        HELM_RELEASE_NAME = 'ecommerce'
        HELM_NAMESPACE = 'default'
    }

    stages {
        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    def components = ['api-gateway', 'order-service', 'product-service']
                    components.each { component ->
                        sh """
                        docker build -t ${DOCKER_REGISTRY}/${DOCKER_REPO}/${component}:latest ./${component}
                        """
                    }
                }
            }
        }

        stage('Push Docker Images') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', 'docker-credentials') {
                        def components = ['api-gateway', 'order-service', 'product-service']
                        components.each { component ->
                            sh """
                            docker push ${DOCKER_REGISTRY}/${DOCKER_REPO}/${component}:latest
                            """
                        }
                    }
                }
            }
        }

        stage('Deploy to Kubernetes with Helm') {
            steps {
                script {
                    sh """
                    export KUBECONFIG=${KUBECONFIG_PATH}

                    helm upgrade --install ${HELM_RELEASE_NAME} ./helm \
                        --namespace ${HELM_NAMESPACE} \
                        --set apiGateway.image=${DOCKER_REGISTRY}/${DOCKER_REPO}/api-gateway:latest \
                        --set orderService.image=${DOCKER_REGISTRY}/${DOCKER_REPO}/order-service:latest \
                        --set productService.image=${DOCKER_REGISTRY}/${DOCKER_REPO}/product-service:latest
                    """
                }
            }
        }
    }

    post {
  always {
    script {
       //skip the step if context is missing
       if (getContext(hudson.FilePath)) {
         echo "It works"
       }
     }
   }
 }
}
