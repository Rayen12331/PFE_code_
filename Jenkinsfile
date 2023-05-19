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
                // Define deployment steps using SSH
                sh 'ssh <rayen>@<127.0.0.1> "mkdir -p </home/project>"'
                sh 'scp -r <C:\Users\LENOVO\.jenkins\workspace\PFE deployment> <rayen>@<127.0.0.1>:</home/project>'
                // Add any additional deployment steps as required
            }
        }
       
       

       
    }
}
