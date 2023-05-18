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
                bat 'cd Frontend && cd client && npm install' // Example build step using Maven
                bat 'cd Frontend && cd server && yarn install && yarn install -g nodemon'

            }
        }

        stage('Deploy') {
            steps {
                // Insert your deployment steps here
                sshagent(['your-ssh-credentials']) {
                    bat 'ssh user@your-vm-address "cd /path/to/deployment; git pull"'
                    bat 'ssh user@your-vm-address "cd /path/to/deployment; ./deploy.sh"'
                    // Replace 'user', 'your-vm-address', '/path/to/deployment', and 'deploy.sh' with the appropriate values
                }
            }
        }
    }
}
