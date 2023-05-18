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

       
    }
}
