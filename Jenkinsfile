pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                // Checkout the source code from your Git repository
                git 'https://github.com/Rayen12331/PFE_code_.git'
            }
        }

        stage('Build') {
            steps {
                // Build the client
                dir('client') {
                    sh 'npm install'
                    sh 'npm run build'
                }
                
                // Build the server
                dir('server') {
                    sh 'npm install'
                }
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
