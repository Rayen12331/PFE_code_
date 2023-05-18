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
        
        stage('Deploy') {
            steps {
                script {
                    sh 'ssh rayen@127.0.0.1 "mkdir -p /home/project"' // Create deployment directory on Ubuntu VM
                    sh 'scp -r Frontend rayen@127.0.0.1:/home/project' // Transfer the Frontend directory to Ubuntu VM
                    // Add additional deployment steps as needed
                }
            }
        }
       

       
    }
}
