pipeline {
    agent any

    stages {
        stage('Clone project') {
            steps {
                // Checkout the source code from your Git repository
                git 'https://github.com/Rayen12331/PFE_code_.git'
            }
        }

        stage('Build') {
            steps {
                // Install dependencies and build the React app
                sh 'cd C:/Users/LENOVO/.jenkins/workspace/PFEdeployment/Frontend/client && npm install'

                // Install dependencies and build the Node.js server
                sh 'cd Frontend/server && npm install'
            }
        }

        stage('Deploy') {
            steps {
                // Example: Deploy to a remote server using SSH
                sshagent(['your-ssh-credentials-id']) {
                    sh 'ssh user@your-server-ip "cd /path/to/server && git pull && npm install && pm2 restart your-app"'
                }
                
                // Additional deployment steps or actions as per your requirements
            }
        }
    }
}
