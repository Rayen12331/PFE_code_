pipeline {
    agent any

    stages {
        
        
        stage('Copy to VM') {
            steps {
                // Replace the placeholders with the appropriate values for your setup
                script {
                    def vmUsername = 'rayen'
                    def vmPassword = 'rayen'
                    def vmIP = '192.168.59.131'
                    def localProjectPath = 'C:/Users/LENOVO/Desktop/"backup api"'
                    def remoteDestinationPath = '/home/rayen/project'

                    // Copy the project to the VM using scp
                    ssh "scp -r ${localProjectPath} ${vmUsername}@${vmIP}:${remoteDestinationPath}"
                }
            }
        }
       
       

       
    }
}
