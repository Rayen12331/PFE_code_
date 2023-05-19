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
                bat 'cd Frontend && cd server && yarn install'

            }
        }
        
        stage('Copy to VM') {
            steps {
                // Replace the placeholders with the appropriate values for your setup
                script {
                    def vmUsername = 'rayen'
                    def vmPassword = 'rayen'
                    def vmIP = '192.168.59.131'
                    def localProjectPath = 'C:/Users/LENOVO/.jenkins/workspace/PFE deployment'
                    def remoteDestinationPath = '/home/project'

                    // Copy the project to the VM using scp
                    bat "scp -r ${localProjectPath} ${vmUsername}@${vmIP}:${remoteDestinationPath}"
                }
            }
        }
       
       

       
    }
}
