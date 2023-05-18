pipeline {
    agent any

    stages {
        stage('Clone') {
            steps {
                git 'https://github.com/Rayen12331/PFE_code_.git'
            }
        }

        stage('Build') {
            steps {
                // Insert your build steps here
                sh 'cd Frontend' // Example build step using Maven
                sh 'cd client'
                sh 'npm install'

            }
        }

        stage('Deploy') {
            steps {
                // Insert your deployment steps here
                sshagent(['your-ssh-credentials']) {
                    sh 'ssh user@your-vm-address "cd /path/to/deployment; git pull"'
                    sh 'ssh user@your-vm-address "cd /path/to/deployment; ./deploy.sh"'
                    // Replace 'user', 'your-vm-address', '/path/to/deployment', and 'deploy.sh' with the appropriate values
                }
            }
        }
    }
}
