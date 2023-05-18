pipeline {
    agent any
    stages {
        stage('Build MERN Project') {
            steps {
                // Checkout MERN project code from version control
                git branch: 'master', url: 'https://github.com/Rayen12331/PFE_code_.git'

                // Install dependencies and build MERN project
                sh 'cd C:\\Users\\LENOVO\\.jenkins\\workspace\\Deployment tool Pipeline\\Frontend\\client && npm install && npm run build'
                sh 'cd C:\\Users\\LENOVO\\.jenkins\\workspace\\Deployment tool Pipeline\\Frontend\\server && npm install && npm install -g nodemon && nodemon'
                sh 'cd C:\\Users\\LENOVO\\.jenkins\\workspace\\Deployment tool Pipeline && uvicorn api:app --reload'
            }
        }
        
        stage('Deploy') {
            steps {
                sshagent(credentials: ['rayen']) {
                    sh 'scp -r C:\\Users\\LENOVO\\.jenkins\\workspace\\Deployment tool Pipeline rayen@127.0.0.1:/var/lib/jenkins/workspace/' // Copy the MERN project files to the VM
                    sh 'ssh -o StrictHostKeyChecking=no rayen@127.0.0.1 "cd /var/lib/jenkins/workspace/ && npm install"' // Install dependencies for the MERN project on the VM
                    sh 'ssh -o StrictHostKeyChecking=no rayen@127.0.0.1 "sudo systemctl start your-service"' // Start the service on the VM
                }
            }
        }
    }
}
