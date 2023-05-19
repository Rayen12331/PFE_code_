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
        
        stage('Configure SSH Access') {
            steps {
                // Generate SSH key pair
                bat 'ssh-keygen -t rsa -b 4096 -C "rayenrayen1@yahoo.fr" -f ~/.ssh/id_rsa -q -N ""'
                
                // Add public key to the virtual machine
                bat 'sshpass -p "<rayen>" ssh-copy-id -i ~/.ssh/id_rsa.pub <rayen>@<127.0.0.1>'
            }
        }
       
       

       
    }
}
