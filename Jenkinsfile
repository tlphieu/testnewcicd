pipeline {
  agent any
  options {
    skipDefaultCheckout(true)
    disableConcurrentBuilds()
    timeout(time: 15, unit: 'MINUTES')
  }
  parameters {
    booleanParam(name: 'DEPLOY_TO_RENDER', defaultValue: false,
                 description: 'Deploy main after CI; requires Render credential')
  }
  stages {
    stage('Checkout') {
      steps {
        deleteDir()
        checkout scm
        script {
          env.TESTED_SHA = sh(
            script: 'git rev-parse HEAD',
            returnStdout: true
          ).trim()
        }
      }
    }
    stage('Install') {
      steps { sh 'node --version && npm ci --include=dev' }
    }
    stage('Syntax') {
      steps {
        sh 'node --check server.js && node --check server.test.js'
      }
    }
    stage('Tests') {
      steps { sh 'npm test -- --runInBand' }
      post {
        always {
          archiveArtifacts artifacts: 'coverage/**',
                           allowEmptyArchive: true
        }
      }
    }
    stage('Audit') {
      steps { sh 'npm audit --omit=dev --audit-level=high' }
    }
    stage('Deploy Render') {
      when {
        allOf {
          expression { return params.DEPLOY_TO_RENDER }
          branch 'main'
          not { changeRequest() }
        }
      }
      steps {
        withCredentials([string(
          credentialsId: 'render-deploy-hook',
          variable: 'RENDER_DEPLOY_HOOK_URL'
        )]) {
          sh '''
            set +x
            curl --fail --silent --show-error \
              --output /dev/null --request POST \
              "${RENDER_DEPLOY_HOOK_URL}&ref=${TESTED_SHA}"
          '''
        }
        echo 'Check deployment completion in Render Events.'
      }
    }
  }
}
