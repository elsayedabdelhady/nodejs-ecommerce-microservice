pipeline {
    agent any

    environment {
        DOCKER_REGISTRY = 'docker.io'
        DOCKER_REPO = 'elsayed2020'
        KUBECONFIG_PATH = credentials('KUBECONFIG')
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
                    def components = ['api-gateway-service', 'order-service', 'product-service','auth-service' ]
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
                    docker.withRegistry('https://index.docker.io/v1/', 'DOCKER_HUB_CREDS') {
                        def components = ['api-gateway-service', 'order-service', 'product-service','auth-service']
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

                    helm upgrade --install ${HELM_RELEASE_NAME} ./microservices-app 
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
